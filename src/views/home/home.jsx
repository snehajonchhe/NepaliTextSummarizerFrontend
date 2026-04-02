import "./home.css"
import { useState, useRef, useEffect, useCallback } from "react";
import summaryController from "../../controller/summary-controller";
import transcriptionController from "../../controller/transcription-controller";
import { Link } from "react-router-dom";
import { encodeWAV } from "../../utils/wav-encoder";

const Home = () => {
  // Input states
  const [inputText, setInputText] = useState("");
  const [activeInputMethod, setActiveInputMethod] = useState("text"); // audio, text, file
  const [selectedModel, setSelectedModel] = useState("abstractive");
  
  // Output states
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [activeTab, setActiveTab] = useState("transcription"); // transcription, summary
  const [audioUrl, setAudioUrl] = useState(null);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs for custom AudioContext recording
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const gainNodeRef = useRef(null);
  const recordingDataRef = useRef([]);
  const isCurrentlyRecordingRef = useRef(false);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopRecordingResources();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (window._globalAudioProcessor) {
        window._globalAudioProcessor.disconnect();
        delete window._globalAudioProcessor;
      }
    };
  }, [audioUrl]);

  const stopRecordingResources = useCallback(() => {
    isCurrentlyRecordingRef.current = false;
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
    if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
    }
    if (window._globalAudioProcessor) {
        window._globalAudioProcessor.disconnect();
        delete window._globalAudioProcessor;
    }
  }, []);

  const handleSummarize = async () => {
    const textToSummarize = activeInputMethod === "text" ? inputText : transcription;
    
    if (!textToSummarize.trim()) {
      setError("Please provide content to summarize");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");
    
    try {
      const response = await summaryController({ 
        "text": textToSummarize, 
        "model-type": selectedModel 
      });
      
      if (response && response.summary) {
        setSummary(response.summary);
        setActiveTab("summary");
      } else if (response && response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during summarization");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith(".txt")) {
        setError("");
        setAudioUrl(null);
        const reader = new FileReader();
        reader.onload = () => {
          setTranscription(reader.result);
          setActiveTab("transcription");
        };
        reader.readAsText(file);
      } else if (file.name.endsWith(".mp3") || file.name.endsWith(".wav") || file.name.endsWith(".m4a") || file.name.endsWith(".flac")) {
        setError("");
        setLoading(true);
        
        // Create preview URL
        const url = URL.createObjectURL(file);
        setAudioUrl(url);

        try {
            const response = await transcriptionController(file);
            if (response && response.transcription) {
                setTranscription(response.transcription);
                setActiveTab("transcription");
            } else if (response && response.error) {
                setError(response.error);
            }
        } catch (err) {
            setError(err.message || "Transcription failed");
        } finally {
            setLoading(false);
        }
      } else {
        setError("Unsupported file format. Please upload .txt, .mp3, .wav, .m4a, or .flac.");
      }
    }
  };

  const startRecording = async () => {
    try {
      stopRecordingResources();
      setTranscription("");
      setAudioUrl(null);
      setError("");
      recordingDataRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;
      gainNode.gain.value = 1;
      
      const processor = audioContext.createScriptProcessor(16384, 1, 1);
      processorRef.current = processor;
      window._globalAudioProcessor = processor;
      
      source.connect(gainNode);
      gainNode.connect(processor);
      processor.connect(audioContext.destination);
      
      isCurrentlyRecordingRef.current = true;
      setIsRecording(true);

      processor.onaudioprocess = (e) => {
        if (isCurrentlyRecordingRef.current) {
            const inputData = e.inputBuffer.getChannelData(0);
            const copy = new Float32Array(inputData.length);
            copy.set(inputData);
            recordingDataRef.current.push(copy);
        }
      };
      
    } catch (err) {
      console.error("Microphone access denied", err);
      setError("Microphone access denied. Please allow access.");
    }
  };

  const stopRecording = async () => {
    if (!isCurrentlyRecordingRef.current) return;
    isCurrentlyRecordingRef.current = false;
    setIsRecording(false);
    setLoading(true);

    setTimeout(async () => {
        try {
            const capturedData = [...recordingDataRef.current];
            const sampleRateValue = audioContextRef.current ? audioContextRef.current.sampleRate : 44100;

            if (processorRef.current) processorRef.current.disconnect();
            if (gainNodeRef.current) gainNodeRef.current.disconnect();
            if (sourceRef.current) sourceRef.current.disconnect();
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());

            if (capturedData.length === 0) {
               setError("No audio data captured.");
               setLoading(false);
               return;
            }

            const totalLength = capturedData.reduce((acc, curr) => acc + curr.length, 0);
            const floatData = new Float32Array(totalLength);
            let offset = 0;
            for (let chunk of capturedData) {
                floatData.set(chunk, offset);
                offset += chunk.length;
            }

            const TmpCtx = window.AudioContext || window.webkitAudioContext;
            const tmpCtx = new TmpCtx({sampleRate: sampleRateValue});
            const audioBuffer = tmpCtx.createBuffer(1, totalLength, sampleRateValue);
            audioBuffer.getChannelData(0).set(floatData);
            
            const wavBlob = encodeWAV(audioBuffer);
            const audioFile = new File([wavBlob], "recording.wav", { type: 'audio/wav' });
            
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            const url = URL.createObjectURL(wavBlob);
            setAudioUrl(url);

            const response = await transcriptionController(audioFile);
            if (response && response.transcription) {
                setTranscription(response.transcription);
                setActiveTab("transcription");
            } else if (response && response.error) {
                setError("Transcription error: " + response.error);
            }
            
            tmpCtx.close();
        } catch (err) {
            console.error("Audio stop error", err);
            setError("Processing failed: " + err.message);
        } finally {
            setLoading(false);
            stopRecordingResources();
        }
    }, 300);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const clearAll = () => {
    setTranscription("");
    setSummary("");
    setError("");
    setInputText("");
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  return (
    <div className="home-root">
      {/* Header */}
      <div className="header-new">
        <div className="container">
          <h1>नेपाली भाषा सारांश</h1>
          <p>Advanced Speech-to-Text Summarizer for Nepali Language</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <ul>
            <div className="nav-left">
              <li><Link to="/home" className="active-nav"><i className="fas fa-home"></i> Home</Link></li>
            </div>
            <div className="nav-right">
              <li><Link to="/feature"><i className="fas fa-cogs"></i> Features</Link></li>
              <li><Link to="/about"><i className="fas fa-info-circle"></i> About Us</Link></li>
            </div>
          </ul>
        </div>
      </nav>

      <div className="container">
        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '1rem', background: '#fee2e2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca'}}>{error}</div>}
        
        <div className="main-layout">
          {/* Input Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Input Methods</h2>
              <p className="card-description">Choose how you want to provide your content</p>
            </div>
            <div className="card-content">
              <div className="input-methods">
                <button 
                  className={`input-method ${activeInputMethod === "audio" ? "active" : ""}`}
                  onClick={() => setActiveInputMethod("audio")}
                >
                  🎙️ Audio Recording
                </button>
                <button 
                  className={`input-method ${activeInputMethod === "text" ? "active" : ""}`}
                  onClick={() => setActiveInputMethod("text")}
                >
                  ✍️ Text Input
                </button>
                <button 
                  className={`input-method ${activeInputMethod === "file" ? "active" : ""}`}
                  onClick={() => setActiveInputMethod("file")}
                >
                  📁 File Upload
                </button>
              </div>

              {/* Audio Input */}
              {activeInputMethod === "audio" && (
                <div className="audio-section">
                  <button 
                    className={`record-button ${isRecording ? "recording" : ""}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                  >
                    🎙️
                  </button>
                  <div className="status-text" style={{fontWeight: '500', color: isRecording ? '#ef4444' : '#64748b'}}>
                    {isRecording ? "🔴 Recording in progress..." : loading ? "⏳ Processing Audio..." : "Click microphone to start recording"}
                  </div>
                  <div className="audio-controls" style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem'}}>
                    {isRecording && (
                       <button className="process-btn" style={{backgroundColor: '#ef4444'}} onClick={stopRecording} disabled={loading}>⏹️ Stop</button>
                    )}
                    <button className="process-btn" style={{backgroundColor: '#64748b'}} onClick={clearAll} disabled={loading || isRecording}>🗑️ Clear</button>
                  </div>
                </div>
              )}

              {/* Text Input */}
              {activeInputMethod === "text" && (
                <div className="text-input-section">
                  <textarea
                    className="text-input-area"
                    placeholder="यहाँ आफ्नो नेपाली पाठ लेख्नुहोस्... | Write your Nepali text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                  <div className="text-controls" style={{marginTop: '1rem'}}>
                    <div style={{marginBottom: '15px', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
                       <strong style={{color: '#475569'}}>Summary Type:</strong>
                       <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#1e293b'}}>
                         <input 
                           type="radio" 
                           name="model-text" 
                           value="abstractive" 
                           checked={selectedModel==="abstractive"} 
                           onChange={()=>setSelectedModel("abstractive")} 
                         /> Abstractive
                       </label>
                       <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#1e293b'}}>
                         <input 
                           type="radio" 
                           name="model-text" 
                           value="extractive" 
                           checked={selectedModel==="extractive"} 
                           onChange={()=>setSelectedModel("extractive")} 
                         /> Extractive
                       </label>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div className="char-count" style={{color: '#64748b'}}>{inputText.length} / 5000 characters</div>
                      <button className="process-btn" onClick={handleSummarize} disabled={loading}>
                        {loading ? "Processing..." : "⚡ Summarize Text"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* File Input */}
              {activeInputMethod === "file" && (
                <div className="file-input-section">
                  <div 
                    className="file-upload-area" 
                    onClick={() => document.getElementById('file-input-field').click()}
                    style={{pointerEvents: (loading || isRecording) ? 'none' : 'auto', opacity: (loading || isRecording) ? 0.6 : 1}}
                  >
                    <input 
                      type="file" 
                      id="file-input-field" 
                      style={{display: 'none'}} 
                      onChange={handleFileUpload}
                      accept=".txt,.mp3,.wav,.m4a,.flac"
                      disabled={loading || isRecording}
                    />
                    <div className="file-upload-content">
                      <div className="file-upload-icon">
                        <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-cloud-upload-alt"}></i>
                      </div>
                      <h3>{loading ? "Transcribing Audio..." : "Click to browse or drag content here"}</h3>
                      <p>{loading ? "कृपया पर्खनुहोस्..." : "फाइल यहाँ अपलोड गर्नुहोस् (Audio or Text)"}</p>
                      {!loading && <div className="supported-formats">Supported: TXT, MP3, WAV, M4A, FLAC</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Results</h2>
              <p className="card-description">View transcription and summary</p>
            </div>
            <div className="card-content">
              <div className="output-tabs">
                <button 
                  className={`output-tab ${activeTab === "transcription" ? "active" : ""}`}
                  onClick={() => setActiveTab("transcription")}
                >
                  📝 Transcription
                </button>
                <button 
                  className={`output-tab ${activeTab === "summary" ? "active" : ""}`}
                  onClick={() => setActiveTab("summary")}
                >
                  📋 Summary
                </button>
              </div>

              {activeTab === "transcription" && (
                <div className="output-box">
                  {loading && !isRecording ? <div style={{textAlign: 'center', padding: '2rem'}}>Processing...</div> : (
                    <>
                      {audioUrl && (
                        <div className="audio-player-container" style={{marginBottom: '1.5rem', padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                          <p style={{fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px'}}>PLAYBACK:</p>
                          <audio src={audioUrl} controls style={{width: '100%', height: '35px'}} />
                        </div>
                      )}
                      <div className="transcription-text">
                        {transcription || "Your transcribed text will appear here..."}
                      </div>
                    </>
                  )}
                  {transcription && !loading && (
                    <>
                      <button className="copy-btn" onClick={() => copyToClipboard(transcription)}>📋 Copy</button>
                      <div style={{marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
                        <div style={{marginBottom: '10px', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                           <strong>Summarization Model:</strong>
                           <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                             <input 
                               type="radio" 
                               name="model" 
                               value="abstractive" 
                               checked={selectedModel==="abstractive"} 
                               onChange={()=>setSelectedModel("abstractive")} 
                             /> Abstractive
                           </label>
                           <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                             <input 
                               type="radio" 
                               name="model" 
                               value="extractive" 
                               checked={selectedModel==="extractive"} 
                               onChange={()=>setSelectedModel("extractive")} 
                             /> Extractive
                           </label>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                           <button className="process-btn" onClick={handleSummarize} disabled={loading}>
                             {loading ? "Summarizing..." : "✨ Generate Summary"}
                           </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "summary" && (
                <div className="output-box summary">
                   {loading ? <div style={{textAlign: 'center', padding: '2rem'}}>Summarizing...</div> : (summary || "Summary will appear here after you click 'Generate Summary'.")}
                   {summary && !loading && (
                      <button className="copy-btn" onClick={() => copyToClipboard(summary)}>📋 Copy</button>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;