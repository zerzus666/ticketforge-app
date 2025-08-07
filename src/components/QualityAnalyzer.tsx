import React, { useState } from 'react';
import { Search, TrendingUp, Shield, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

const QualityAnalyzer: React.FC = () => {
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const qualityFactors = [
    {
      name: 'Domain Authority',
      score: 85,
      weight: 25,
      description: 'Overall domain strength and trustworthiness',
      status: 'excellent'
    },
    {
      name: 'Page Authority',
      score: 78,
      weight: 20,
      description: 'Individual page ranking power',
      status: 'good'
    },
    {
      name: 'Trust Flow',
      score: 82,
      weight: 20,
      description: 'Quality of sites linking to this domain',
      status: 'excellent'
    },
    {
      name: 'Citation Flow',
      score: 75,
      weight: 15,
      description: 'Quantity of links pointing to this domain',
      status: 'good'
    },
    {
      name: 'Relevance Score',
      score: 92,
      weight: 15,
      description: 'Topical relevance to your niche',
      status: 'excellent'
    },
    {
      name: 'Spam Score',
      score: 8,
      weight: 5,
      description: 'Risk indicators (lower is better)',
      status: 'excellent',
      inverted: true
    }
  ];

  const overallScore = Math.round(
    qualityFactors.reduce((total, factor) => {
      const normalizedScore = factor.inverted ? 100 - factor.score : factor.score;
      return total + (normalizedScore * factor.weight / 100);
    }, 0)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-600 bg-emerald-100';
      case 'good':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number, inverted = false) => {
    const effectiveScore = inverted ? 100 - score : score;
    if (effectiveScore >= 80) return 'text-emerald-600';
    if (effectiveScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quality Analyzer</h1>
          <p className="text-gray-600 mt-1">Analyze backlink quality with our advanced scoring algorithm</p>
        </div>
      </div>

      {/* URL Analyzer */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyze New Backlink</h3>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="url"
              placeholder="Enter URL to analyze quality (e.g., https://example.com/article)"
              value={analyzeUrl}
              onChange={(e) => setAnalyzeUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!analyzeUrl || isAnalyzing}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Quality</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overall Quality Score */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Overall Quality Score</h3>
            <p className="text-blue-100">Based on 6 key ranking factors</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold">{overallScore}</div>
            <div className="text-blue-100">out of 100</div>
          </div>
        </div>
        <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {overallScore >= 80 ? (
              <CheckCircle className="w-6 h-6 text-emerald-300" />
            ) : overallScore >= 60 ? (
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-300" />
            )}
            <span className="font-medium">
              {overallScore >= 80 
                ? 'Excellent quality backlink - Highly recommended' 
                : overallScore >= 60 
                ? 'Good quality backlink - Worth pursuing' 
                : 'Low quality backlink - Consider avoiding'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Quality Factors Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quality Factors Breakdown</h3>
        <div className="space-y-6">
          {qualityFactors.map((factor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(factor.status)}`}>
                    {factor.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Weight: {factor.weight}%</span>
                  <span className={`text-2xl font-bold ${getScoreColor(factor.score, factor.inverted)}`}>
                    {factor.score}{factor.name === 'Spam Score' ? '/100' : ''}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Score</span>
                  <span>{factor.score}{factor.name === 'Spam Score' ? ' (lower is better)' : ''}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      factor.inverted 
                        ? (factor.score <= 20 ? 'bg-emerald-500' : factor.score <= 40 ? 'bg-yellow-500' : 'bg-red-500')
                        : (factor.score >= 80 ? 'bg-emerald-500' : factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500')
                    }`}
                    style={{ width: `${factor.inverted ? 100 - factor.score : factor.score}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Recommendations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quality Improvement Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-emerald-900">Target High-Authority Sites</h4>
              <p className="text-emerald-700 text-sm">Focus on domains with DA 70+ for maximum SEO impact</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Prioritize Relevant Content</h4>
              <p className="text-blue-700 text-sm">Seek backlinks from pages topically related to your niche</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
            <Shield className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Avoid Low-Quality Sources</h4>
              <p className="text-yellow-700 text-sm">Skip sites with high spam scores or suspicious link patterns</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900">Monitor Quality Metrics</h4>
              <p className="text-purple-700 text-sm">Regularly track your backlink profile's overall health</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAnalyzer;