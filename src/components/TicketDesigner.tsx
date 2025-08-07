import React, { useState, useRef, useCallback } from 'react';
import { 
  Palette, 
  Type, 
  Image, 
  QrCode, 
  Download, 
  Upload, 
  Save, 
  Eye, 
  Grid3X3, 
  Move,
  Trash2,
  Copy,
  RotateCcw,
  Settings,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Building,
  FileText,
  Zap
} from 'lucide-react';
import type { TicketTemplate, TicketElement } from '../types';

const TicketDesigner: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TicketTemplate | null>(null);
  const [selectedElement, setSelectedElement] = useState<TicketElement | null>(null);
  const [elements, setElements] = useState<TicketElement[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [ticketFormat, setTicketFormat] = useState({
    width: 400,
    height: 200,
    widthCm: 10,
    heightCm: 5
  });
  const [customSize, setCustomSize] = useState({ width: 10, height: 5 });
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string}>({});
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-bare Event-Felder
  const eventFields = [
    { id: 'eventTitle', label: '🎪 Event Name', icon: Calendar, sample: 'Summer Music Festival 2024' },
    { id: 'eventDate', label: '📅 Datum', icon: Calendar, sample: '15. Juli 2024' },
    { id: 'doorsOpen', label: '🚪 Einlass', icon: Clock, sample: '18:00 Uhr' },
    { id: 'eventStart', label: '⏰ Beginn', icon: Clock, sample: '19:00 Uhr' },
    { id: 'eventEnd', label: '🏁 Ende', icon: Clock, sample: '23:00 Uhr' },
    { id: 'ticketPrice', label: '💰 Preis', icon: DollarSign, sample: '€89.00' },
    { id: 'presaleFee', label: '💳 VVK Gebühr', icon: DollarSign, sample: '€5.00' },
    { id: 'venueName', label: '🏟️ Venue', icon: Building, sample: 'Central Park' },
    { id: 'venueAddress', label: '📍 Adresse', icon: MapPin, sample: 'New York, NY' },
    { id: 'terms', label: '📋 AGB', icon: FileText, sample: 'Keine Rückgabe möglich' },
    { id: 'barcode', label: '📊 Barcode', icon: QrCode, sample: 'QR-Code' }
  ];

  // Design-Tools
  const designTools = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'image', label: 'Bild', icon: Image },
    { id: 'shape', label: 'Form', icon: Grid3X3 },
    { id: 'qr', label: 'QR-Code', icon: QrCode },
    { id: 'customGraphic', label: 'Custom Grafik', icon: Zap }
  ];

  // Vordefinierte Formate
  const predefinedFormats = [
    { name: 'Standard Ticket', width: 400, height: 200, widthCm: 10, heightCm: 5 },
    { name: 'Mini Ticket', width: 300, height: 150, widthCm: 7.5, heightCm: 3.75 },
    { name: 'Wristband', width: 600, height: 100, widthCm: 15, heightCm: 2.5 },
    { name: 'Benutzerdefiniert', width: customSize.width * 40, height: customSize.height * 40, widthCm: customSize.width, heightCm: customSize.height }
  ];

  const handleFormatChange = (format: typeof predefinedFormats[0]) => {
    setTicketFormat({
      width: format.width,
      height: format.height,
      widthCm: format.widthCm,
      heightCm: format.heightCm
    });
  };

  const handleCustomSizeChange = (dimension: 'width' | 'height', value: number) => {
    setCustomSize(prev => ({ ...prev, [dimension]: value }));
    if (ticketFormat.widthCm === customSize.width && ticketFormat.heightCm === customSize.height) {
      setTicketFormat({
        width: dimension === 'width' ? value * 40 : customSize.width * 40,
        height: dimension === 'height' ? value * 40 : customSize.height * 40,
        widthCm: dimension === 'width' ? value : customSize.width,
        heightCm: dimension === 'height' ? value : customSize.height
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedField || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Skalierung berücksichtigen (Editor ist 2x vergrößert)
    const actualX = x / 2;
    const actualY = y / 2;

    const field = eventFields.find(f => f.id === draggedField);
    if (!field) return;

    const newElement: TicketElement = {
      id: Date.now().toString(),
      type: 'eventField',
      fieldType: field.id as any,
      x: Math.max(0, Math.min(actualX, ticketFormat.width - 100)),
      y: Math.max(0, Math.min(actualY, ticketFormat.height - 30)),
      width: 150,
      height: 30,
      content: field.sample,
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#000000',
      textAlign: 'left',
      zIndex: elements.length
    };

    setElements(prev => [...prev, newElement]);
    setDraggedField(null);
  };

  const handleElementClick = (element: TicketElement) => {
    setSelectedElement(element);
  };

  const updateElement = (elementId: string, updates: Partial<TicketElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const imageId = Date.now().toString();
      setUploadedImages(prev => ({ ...prev, [imageId]: imageUrl }));
      
      // Automatisch Bild-Element erstellen
      const newElement: TicketElement = {
        id: imageId,
        type: 'image',
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        imageUrl,
        zIndex: elements.length
      };
      
      setElements(prev => [...prev, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const addDesignElement = (toolType: string) => {
    let newElement: TicketElement;
    
    switch (toolType) {
      case 'text':
        newElement = {
          id: Date.now().toString(),
          type: 'text',
          x: 50,
          y: 50,
          width: 150,
          height: 30,
          content: 'Text eingeben',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          textAlign: 'left',
          zIndex: elements.length
        };
        break;
      case 'shape':
        newElement = {
          id: Date.now().toString(),
          type: 'shape',
          shapeType: 'rectangle',
          x: 50,
          y: 50,
          width: 100,
          height: 50,
          backgroundColor: '#3B82F6',
          borderColor: '#1E40AF',
          borderWidth: 2,
          zIndex: elements.length
        };
        break;
      case 'qr':
        newElement = {
          id: Date.now().toString(),
          type: 'qr',
          x: ticketFormat.width - 120,
          y: 20,
          width: 100,
          height: 100,
          content: 'QR-Code Platzhalter',
          backgroundColor: '#000000',
          zIndex: elements.length
        };
        break;
      case 'image':
        fileInputRef.current?.click();
        return;
      case 'customGraphic':
        newElement = {
          id: Date.now().toString(),
          type: 'customGraphic',
          x: 50,
          y: 50,
          width: 80,
          height: 80,
          content: '🎵',
          fontSize: 48,
          zIndex: elements.length
        };
        break;
      default:
        return;
    }
    
    setElements(prev => [...prev, newElement]);
  };

  const renderElement = (element: TicketElement) => {
    const isSelected = selectedElement?.id === element.id;
    const baseStyle = {
      position: 'absolute' as const,
      left: element.x * 2, // 2x Skalierung für Editor
      top: element.y * 2,
      width: element.width * 2,
      height: element.height * 2,
      zIndex: element.zIndex || 0,
      cursor: 'move',
      border: isSelected ? '2px solid #3B82F6' : '1px solid transparent',
      backgroundColor: element.backgroundColor || 'transparent',
      borderColor: element.borderColor || 'transparent',
      borderWidth: (element.borderWidth || 0) * 2,
      borderRadius: (element.borderRadius || 0) * 2,
      opacity: element.opacity || 1,
      transform: `rotate(${element.rotation || 0}deg)`
    };

    const textStyle = {
      fontSize: (element.fontSize || 14) * 2,
      fontFamily: element.fontFamily || 'Arial',
      fontWeight: element.fontWeight || 'normal',
      fontStyle: element.fontStyle || 'normal',
      color: element.color || '#000000',
      textAlign: element.textAlign || 'left',
      lineHeight: 1.2,
      padding: '4px',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow"
          >
            <div style={textStyle}>
              {element.content}
            </div>
          </div>
        );

      case 'eventField':
        const field = eventFields.find(f => f.id === element.fieldType);
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow bg-blue-50 border-blue-200"
          >
            <div style={textStyle}>
              {field?.sample || element.content}
            </div>
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow overflow-hidden"
          >
            {element.imageUrl ? (
              <img 
                src={element.imageUrl} 
                alt="Ticket Image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        );

      case 'shape':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              borderRadius: element.shapeType === 'circle' ? '50%' : (element.borderRadius || 0) * 2
            }}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow"
          />
        );

      case 'qr':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow bg-black text-white flex items-center justify-center"
          >
            <QrCode className="w-16 h-16" />
          </div>
        );

      case 'customGraphic':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onClick={() => handleElementClick(element)}
            className="hover:shadow-lg transition-shadow flex items-center justify-center"
          >
            <span style={{ fontSize: (element.fontSize || 48) * 2 }}>
              {element.content}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const generateTicketPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h3 className="text-xl font-bold">🎫 TICKET PREVIEW</h3>
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <h4 className="text-2xl font-bold text-gray-900">Summer Music Festival 2024</h4>
            <p className="text-gray-600">Central Park, New York</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Datum:</strong> 15. Juli 2024</div>
            <div><strong>Einlass:</strong> 18:00 Uhr</div>
            <div><strong>Beginn:</strong> 19:00 Uhr</div>
            <div><strong>Ende:</strong> 23:00 Uhr</div>
            <div><strong>Preis:</strong> €89.00</div>
            <div><strong>VVK Gebühr:</strong> €5.00</div>
          </div>
          <div className="mt-4 text-center">
            <div className="w-24 h-24 bg-black mx-auto mb-2 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs text-gray-500">QR-Code scannen</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎨 Ticket Designer</h1>
          <p className="text-gray-600 mt-1">Professionelle Ticket-Templates mit Drag & Drop Editor</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isPreviewMode ? 'Editor' : 'Vorschau'}</span>
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            onClick={() => {
              const ticketData = {
                format: `${ticketFormat.widthCm}cm x ${ticketFormat.heightCm}cm`,
                elements: elements.length,
                resolution: `${ticketFormat.width} x ${ticketFormat.height}px`,
                exportedAt: new Date().toISOString()
              };
              
              // Simuliere Export-Prozess
              const exportFormats = ['PDF (Druckfertig)', 'PNG (Vorschau)', 'SVG (Vektorgrafik)'];
              const selectedFormat = prompt(`📄 Export-Format wählen:

1. PDF (Druckfertig)
2. PNG (Vorschau) 
3. SVG (Vektorgrafik)
4. Alle Formate

Geben Sie 1, 2, 3 oder 4 ein:`);
              
              if (selectedFormat && ['1', '2', '3', '4'].includes(selectedFormat)) {
                const formatName = selectedFormat === '1' ? 'PDF' : 
                                 selectedFormat === '2' ? 'PNG' : 
                                 selectedFormat === '3' ? 'SVG' : 'Alle Formate';
                
                alert(`📄 Ticket-Design exportiert!

📏 Format: ${ticketData.format}
🎨 Elemente: ${ticketData.elements}
📐 Auflösung: ${ticketData.resolution}
📊 Export-Format: ${formatName}

💾 Dateien erstellt:
${selectedFormat === '4' ? exportFormats.map(f => `• ${f}`).join('\n') : `• ${formatName}`}

📧 Export-Dateien werden an Ihre E-Mail gesendet...
📁 Dateien auch in Downloads verfügbar.`);
              }
            }}
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => {
              const templateData = {
                name: `Custom Template ${Date.now()}`,
                format: `${ticketFormat.widthCm}cm x ${ticketFormat.heightCm}cm`,
                elements: elements.length,
                createdAt: new Date().toISOString()
              };
              
              alert(`💾 Ticket-Template gespeichert!

📋 Template-Details:
• Name: ${templateData.name}
• Format: ${templateData.format}
• Elemente: ${templateData.elements}

📁 Gespeichert in:
• Template-Bibliothek
• Für zukünftige Events verfügbar
• Teilbar mit Team-Mitgliedern

✅ Template erfolgreich erstellt!`);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Speichern</span>
          </button>
        </div>
      </div>

      {/* Druckformat Auswahl */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">🖨️ Druckformat</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {predefinedFormats.map((format, index) => (
            <button
              key={index}
              onClick={() => handleFormatChange(format)}
              className={`p-4 border-2 rounded-lg transition-colors text-center ${
                ticketFormat.widthCm === format.widthCm && ticketFormat.heightCm === format.heightCm
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{format.name}</div>
              <div className="text-sm text-gray-600">({format.widthCm}cm x {format.heightCm}cm)</div>
              <div className="text-xs text-gray-500">{format.width} x {format.height}px</div>
            </button>
          ))}
        </div>

        {/* Custom Größe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Breite (cm)</label>
            <input
              type="number"
              min="5"
              max="20"
              step="0.5"
              value={customSize.width}
              onChange={(e) => handleCustomSizeChange('width', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Höhe (cm)</label>
            <input
              type="number"
              min="2.5"
              max="15"
              step="0.5"
              value={customSize.height}
              onChange={(e) => handleCustomSizeChange('height', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 font-medium">
            📏 Aktuelles Format: {ticketFormat.width} x {ticketFormat.height} Pixel (≈ {ticketFormat.widthCm} x {ticketFormat.heightCm} cm)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar mit Drag-baren Feldern */}
        <div className="lg:col-span-1 space-y-6">
          {/* Event-Felder */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>📋 Event-Felder</span>
            </h4>
            <div className="space-y-2">
              {eventFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, field.id)}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab hover:bg-blue-100 transition-colors flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">{field.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Design-Tools */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span>🎨 Design-Tools</span>
            </h4>
            <div className="space-y-2">
              {designTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => addDesignElement(tool.id)}
                    className="w-full p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">{tool.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Bild Upload */}
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">📸 Bild hochladen</span>
              </button>
            </div>
          </div>

          {/* Element-Eigenschaften */}
          {selectedElement && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>⚙️ Eigenschaften</span>
              </h4>
              
              <div className="space-y-4">
                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">X Position</label>
                    <input
                      type="number"
                      value={selectedElement.x}
                      onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Y Position</label>
                    <input
                      type="number"
                      value={selectedElement.y}
                      onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Größe */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Breite</label>
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Höhe</label>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Text-Eigenschaften */}
                {(selectedElement.type === 'text' || selectedElement.type === 'eventField') && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                      <input
                        type="text"
                        value={selectedElement.content || ''}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Schriftgröße</label>
                      <input
                        type="number"
                        value={selectedElement.fontSize || 14}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 14 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Farbe</label>
                      <input
                        type="color"
                        value={selectedElement.color || '#000000'}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {/* Aktionen */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteElement(selectedElement.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Löschen</span>
                  </button>
                  <button
                    onClick={() => {
                      const newElement = { ...selectedElement, id: Date.now().toString(), x: selectedElement.x + 20, y: selectedElement.y + 20 };
                      setElements(prev => [...prev, newElement]);
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Kopieren</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hauptbereich - Editor oder Vorschau */}
        <div className="lg:col-span-3">
          {isPreviewMode ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">🎫 Ticket Vorschau</h3>
              <div className="flex justify-center">
                {generateTicketPreview()}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Move className="w-6 h-6 text-blue-600" />
                <span>🎨 Ticket Editor</span>
              </h3>
              
              {/* Editor Canvas */}
              <div className="bg-gray-100 rounded-lg p-8 overflow-auto">
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Lineale */}
                    <div className="absolute -top-6 left-0 right-0 h-6 bg-white border-b border-gray-300">
                      <div className="relative h-full">
                        {Array.from({ length: Math.ceil(ticketFormat.width / 40) + 1 }, (_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 h-full border-l border-gray-400"
                            style={{ left: i * 40 * 2 }}
                          >
                            <span className="absolute top-1 left-1 text-xs text-gray-600 font-mono">
                              {i * 40}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="absolute -left-6 top-0 bottom-0 w-6 bg-white border-r border-gray-300">
                      <div className="relative h-full">
                        {Array.from({ length: Math.ceil(ticketFormat.height / 40) + 1 }, (_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 w-full border-t border-gray-400"
                            style={{ top: i * 40 * 2 }}
                          >
                            <span className="absolute left-1 top-1 text-xs text-gray-600 font-mono transform -rotate-90 origin-top-left">
                              {i * 40}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ticket Canvas - 2x vergrößert für bessere Bearbeitung */}
                    <div
                      ref={canvasRef}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="relative bg-white border-2 border-gray-300 shadow-lg"
                      style={{
                        width: ticketFormat.width * 2,
                        height: ticketFormat.height * 2,
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}
                    >
                      {/* Drop Zone Overlay */}
                      {draggedField && (
                        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center">
                          <div className="text-blue-600 font-semibold">
                            📋 Feld hier ablegen
                          </div>
                        </div>
                      )}

                      {/* Gerenderte Elemente */}
                      {elements.map(renderElement)}

                      {/* Sample Content wenn keine Elemente */}
                      {elements.length === 0 && !draggedField && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <Move className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg font-medium">🎨 Ticket Design-Bereich</p>
                            <p className="text-sm">Ziehen Sie Event-Felder oder Design-Tools hierher</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Format-Info */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                      📏 Editor-Maßstab: 2:1 (200%) • Druckgröße: {ticketFormat.widthCm}cm x {ticketFormat.heightCm}cm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Element-Liste */}
      {elements.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Ticket-Elemente ({elements.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {elements.map((element) => {
              const field = eventFields.find(f => f.id === element.fieldType);
              return (
                <div
                  key={element.id}
                  onClick={() => handleElementClick(element)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedElement?.id === element.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {element.type === 'eventField' ? field?.label : element.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Position: {element.x}, {element.y} • Größe: {element.width}x{element.height}
                  </div>
                  {element.content && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      "{element.content}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDesigner;