import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Eye, 
  EyeOff, 
  Upload, 
  Image, 
  Video, 
  Link, 
  Type, 
  Bold, 
  Italic, 
  List, 
  AlignLeft,
  Search,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  eventTitle?: string;
  eventCategory?: string;
  venue?: string;
  onSEOUpdate?: (seoData: SEOData) => void;
}

interface SEOData {
  title: string;
  metaDescription: string;
  keywords: string[];
  readabilityScore: number;
  suggestions: string[];
}

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Event-Beschreibung eingeben...",
  eventTitle,
  eventCategory,
  venue,
  onSEOUpdate
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showSEOPanel, setShowSEOPanel] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaFile[]>([]);
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    metaDescription: '',
    keywords: [],
    readabilityScore: 0,
    suggestions: []
  });
  const [isAnalyzingSEO, setIsAnalyzingSEO] = useState(false);
  
  const quillRef = useRef<ReactQuill>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // WYSIWYG Editor Konfiguration
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => imageInputRef.current?.click(),
        video: () => videoInputRef.current?.click()
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  // Bild-Upload Handler
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validierung
    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilddateien hochladen (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      alert('Bild ist zu groß. Maximum: 5MB');
      return;
    }

    // Bild zu Base64 konvertieren (in Produktion würde man einen Cloud-Service verwenden)
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      // Bild zur Medienliste hinzufügen
      const newMedia: MediaFile = {
        id: Date.now().toString(),
        type: 'image',
        url: imageUrl,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      setUploadedMedia(prev => [...prev, newMedia]);
      
      // Bild in Editor einfügen
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        quill.insertEmbed(range?.index || 0, 'image', imageUrl);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Video-Upload Handler
  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validierung
    if (!file.type.startsWith('video/')) {
      alert('Bitte nur Videodateien hochladen (MP4, WebM, MOV)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB Limit
      alert('Video ist zu groß. Maximum: 50MB');
      return;
    }

    // Video zu Base64 konvertieren
    const reader = new FileReader();
    reader.onload = (event) => {
      const videoUrl = event.target?.result as string;
      
      // Video zur Medienliste hinzufügen
      const newMedia: MediaFile = {
        id: Date.now().toString(),
        type: 'video',
        url: videoUrl,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      setUploadedMedia(prev => [...prev, newMedia]);
      
      // Video in Editor einfügen
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        quill.insertEmbed(range?.index || 0, 'video', videoUrl);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // SEO-Analyse
  const analyzeSEO = useCallback(async () => {
    if (!value.trim()) return;
    
    setIsAnalyzingSEO(true);
    
    // Simuliere SEO-Analyse (in Produktion würde man echte SEO-APIs verwenden)
    setTimeout(() => {
      const textContent = value.replace(/<[^>]*>/g, ''); // HTML entfernen
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
      const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
      
      // Readability Score berechnen (vereinfacht)
      let readabilityScore = 100;
      if (avgWordsPerSentence > 20) readabilityScore -= 20;
      if (wordCount < 150) readabilityScore -= 15;
      if (wordCount > 500) readabilityScore -= 10;
      
      // Keywords extrahieren
      const commonWords = ['der', 'die', 'das', 'und', 'oder', 'aber', 'mit', 'für', 'auf', 'in', 'an', 'zu', 'von', 'bei', 'ist', 'sind', 'war', 'waren', 'haben', 'hat', 'wird', 'werden'];
      const words = textContent.toLowerCase().split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word))
        .reduce((acc: {[key: string]: number}, word) => {
          acc[word] = (acc[word] || 0) + 1;
          return acc;
        }, {});
      
      const topKeywords = Object.entries(words)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);

      // SEO-Vorschläge generieren
      const suggestions = [];
      if (wordCount < 150) suggestions.push('Beschreibung sollte mindestens 150 Wörter haben');
      if (wordCount > 500) suggestions.push('Beschreibung ist sehr lang - erwägen Sie eine Kürzung');
      if (!textContent.toLowerCase().includes(eventTitle?.toLowerCase() || '')) {
        suggestions.push('Event-Titel sollte in der Beschreibung erwähnt werden');
      }
      if (!textContent.toLowerCase().includes(venue?.toLowerCase() || '')) {
        suggestions.push('Venue-Name sollte in der Beschreibung erwähnt werden');
      }
      if (avgWordsPerSentence > 20) suggestions.push('Kürzere Sätze verbessern die Lesbarkeit');
      
      const newSeoData: SEOData = {
        title: eventTitle ? `${eventTitle} - Tickets & Informationen` : '',
        metaDescription: textContent.substring(0, 155) + (textContent.length > 155 ? '...' : ''),
        keywords: topKeywords,
        readabilityScore: Math.max(0, Math.min(100, readabilityScore)),
        suggestions
      };
      
      setSeoData(newSeoData);
      onSEOUpdate?.(newSeoData);
      setIsAnalyzingSEO(false);
    }, 1500);
  }, [value, eventTitle, venue, onSEOUpdate]);

  // Medien-Galerie
  const renderMediaGallery = () => (
    <div className="mt-4">
      <h5 className="font-medium text-gray-900 mb-3">📁 Hochgeladene Medien ({uploadedMedia.length})</h5>
      {uploadedMedia.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedMedia.map((media) => (
            <div key={media.id} className="border border-gray-200 rounded-lg p-3">
              {media.type === 'image' ? (
                <img 
                  src={media.url} 
                  alt={media.name}
                  className="w-full h-20 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="text-xs text-gray-600 truncate">{media.name}</div>
              <div className="text-xs text-gray-500">{Math.round(media.size / 1024)}KB</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Noch keine Medien hochgeladen</p>
        </div>
      )}
    </div>
  );

  // SEO-Panel
  const renderSEOPanel = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span>🎯 SEO-Optimierung</span>
        </h4>
        <button
          onClick={analyzeSEO}
          disabled={isAnalyzingSEO || !value.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {isAnalyzingSEO ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analysiere...</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>SEO analysieren</span>
            </>
          )}
        </button>
      </div>

      {/* Readability Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">📖 Lesbarkeits-Score</span>
          <span className={`font-bold ${
            seoData.readabilityScore >= 80 ? 'text-emerald-600' :
            seoData.readabilityScore >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {seoData.readabilityScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              seoData.readabilityScore >= 80 ? 'bg-emerald-500' :
              seoData.readabilityScore >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${seoData.readabilityScore}%` }}
          ></div>
        </div>
      </div>

      {/* SEO-Titel */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ SEO-Titel</label>
        <input
          type="text"
          value={seoData.title}
          onChange={(e) => setSeoData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Automatisch generiert..."
          maxLength={60}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Optimal: 50-60 Zeichen</span>
          <span className={seoData.title.length > 60 ? 'text-red-500' : 'text-gray-500'}>
            {seoData.title.length}/60
          </span>
        </div>
      </div>

      {/* Meta-Beschreibung */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">📝 Meta-Beschreibung</label>
        <textarea
          value={seoData.metaDescription}
          onChange={(e) => setSeoData(prev => ({ ...prev, metaDescription: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Automatisch aus Beschreibung generiert..."
          maxLength={155}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Optimal: 120-155 Zeichen</span>
          <span className={seoData.metaDescription.length > 155 ? 'text-red-500' : 'text-gray-500'}>
            {seoData.metaDescription.length}/155
          </span>
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Erkannte Keywords</label>
        <div className="flex flex-wrap gap-2">
          {seoData.keywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* SEO-Vorschläge */}
      {seoData.suggestions.length > 0 && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <span>💡 SEO-Verbesserungen</span>
          </h5>
          <div className="space-y-2">
            {seoData.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-yellow-800 text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO-Vorschau */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">🔍 Google-Vorschau</h5>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {seoData.title || eventTitle || 'Event-Titel'}
          </div>
          <div className="text-emerald-600 text-sm">
            https://ticketforge.de/events/{eventTitle?.toLowerCase().replace(/\s+/g, '-') || 'event-name'}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            {seoData.metaDescription || 'Meta-Beschreibung wird automatisch generiert...'}
          </div>
        </div>
      </div>
    </div>
  );

  // Vorschau-Renderer
  const renderPreview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Eye className="w-5 h-5 text-emerald-600" />
        <span>👁️ Live-Vorschau</span>
      </h4>
      <div className="prose prose-blue max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500 italic">Noch keine Beschreibung eingegeben...</p>' }}
          className="min-h-[200px] p-4 border border-gray-200 rounded-lg bg-gray-50"
        />
      </div>
      
      {/* Statistiken */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">
            {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length}
          </div>
          <div className="text-sm text-blue-800">Wörter</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <div className="text-lg font-bold text-emerald-600">
            {value.replace(/<[^>]*>/g, '').length}
          </div>
          <div className="text-sm text-emerald-800">Zeichen</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-lg font-bold text-purple-600">
            {Math.ceil(value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length / 200)}
          </div>
          <div className="text-sm text-purple-800">Min. Lesezeit</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Editor-Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Type className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">📝 Event-Beschreibung</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              showPreview ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPreview ? 'Editor' : 'Vorschau'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSEOPanel(!showSEOPanel)}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              showSEOPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>SEO</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Editor oder Vorschau */}
      {showPreview ? (
        renderPreview()
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ minHeight: '300px' }}
          />
        </div>
      )}

      {/* Media Gallery */}
      {uploadedMedia.length > 0 && !showPreview && renderMediaGallery()}

      {/* SEO-Panel */}
      {showSEOPanel && renderSEOPanel()}

      {/* Quick Actions */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Image className="w-4 h-4" />
            <span>📸 Bild hinzufügen</span>
          </button>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>🎥 Video hinzufügen</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>📊 {value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length} Wörter</span>
          <span>📁 {uploadedMedia.length} Medien</span>
          {seoData.readabilityScore > 0 && (
            <span className={`font-medium ${
              seoData.readabilityScore >= 80 ? 'text-emerald-600' :
              seoData.readabilityScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              🎯 SEO: {seoData.readabilityScore}/100
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WysiwygEditor;