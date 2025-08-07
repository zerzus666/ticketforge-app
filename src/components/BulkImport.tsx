import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';

interface ImportRecord {
  id: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  ticketCategories: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

const BulkImport: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [importData, setImportData] = useState<ImportRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock import data for demonstration
  const mockImportData: ImportRecord[] = [
    {
      id: '1',
      eventTitle: 'Summer Music Festival 2024',
      venue: 'Central Park',
      date: '2024-07-15',
      time: '18:00',
      ticketCategories: 'VIP: $299, General: $89',
      status: 'success'
    },
    {
      id: '2',
      eventTitle: 'Jazz Night',
      venue: 'Blue Note NYC',
      date: '2024-02-20',
      time: '20:00',
      ticketCategories: 'Table: $85, Bar: $45',
      status: 'error',
      errorMessage: 'Invalid venue format'
    },
    {
      id: '3',
      eventTitle: 'Corporate Conference',
      venue: 'Convention Center',
      date: '2024-03-10',
      time: '09:00',
      ticketCategories: 'Standard: $150, Premium: $250',
      status: 'pending'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      processFile(file);
    } else {
      alert('Bitte laden Sie eine CSV-Datei hoch');
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Set mock data after processing
    setImportData(mockImportData);
    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const csvContent = `Event Title,Venue,Date,Time,VIP Price,VIP Capacity,General Price,General Capacity
Summer Music Festival 2024,Central Park,2024-07-15,18:00,299,500,89,10000
Jazz Night at Blue Note,Blue Note NYC,2024-02-20,20:00,85,120,45,80`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const retryImport = (recordId: string) => {
    setImportData(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: 'success' as const, errorMessage: undefined }
        : record
    ));
  };

  const removeRecord = (recordId: string) => {
    setImportData(prev => prev.filter(record => record.id !== recordId));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Import</h1>
          <p className="text-gray-600 mt-1">Import multiple events from CSV files to save time</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Template</span>
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop your CSV file here, or click to browse
          </h3>
          <p className="text-gray-600 mb-6">
            Upload a CSV file with your event data. Maximum file size: 10MB
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Choose File</span>
          </label>
        </div>

        {isProcessing && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Processing file...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Import Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">CSV Format Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Required Columns:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Event Title</li>
              <li>• Venue</li>
              <li>• Date (YYYY-MM-DD)</li>
              <li>• Time (HH:MM)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Optional Columns:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• VIP Price & Capacity</li>
              <li>• General Price & Capacity</li>
              <li>• Premium Price & Capacity</li>
              <li>• Event Description</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Import Results</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-emerald-600">
                  {importData.filter(r => r.status === 'success').length} Success
                </span>
                <span className="text-red-600">
                  {importData.filter(r => r.status === 'error').length} Errors
                </span>
                <span className="text-yellow-600">
                  {importData.filter(r => r.status === 'pending').length} Pending
                </span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {importData.map((record) => (
              <div key={record.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(record.status)}
                      <h4 className="font-semibold text-gray-900">{record.eventTitle}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Venue:</span> {record.venue}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {record.time}
                      </div>
                      <div>
                        <span className="font-medium">Tickets:</span> {record.ticketCategories}
                      </div>
                    </div>
                    
                    {record.errorMessage && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-red-700 text-sm">
                          <strong>Error:</strong> {record.errorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {record.status === 'error' && (
                      <button
                        onClick={() => retryImport(record.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Retry Import"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeRecord(record.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                      title="Remove Record"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {importData.filter(r => r.status === 'success').length} von {importData.length} Events erfolgreich importiert
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setImportData([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Import abbrechen
                </button>
                <button 
                  onClick={() => {
                    const successfulImports = importData.filter(r => r.status === 'success');
                    
                    // Simuliere Import-Prozess
                    console.log('Importing events:', successfulImports);
                    
                    // Events zur globalen Event-Liste hinzufügen (in echter App)
                    // setEvents(prev => [...prev, ...successfulImports]);
                    
                    alert(`✅ ${successfulImports.length} Events erfolgreich importiert!`);
                    setImportData([]);
                  }}
                  disabled={importData.filter(r => r.status === 'success').length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Import bestätigen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-gray-600">Total Imports</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">98.5%</div>
          <div className="text-gray-600">Success Rate</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">2.3s</div>
          <div className="text-gray-600">Avg Processing Time</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">156</div>
          <div className="text-gray-600">Events This Month</div>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;