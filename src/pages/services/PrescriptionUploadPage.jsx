import React, { useState } from 'react';
import { Upload, FileText, Camera, Smartphone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import SEOHelmet from '../../components/SEOHelmet';
import { Button } from '../../components/ui/button';

const PrescriptionUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  const methods = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload from Computer",
      description: "Select and upload prescription files from your computer",
      action: "Choose File"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Take a Photo",
      description: "Use your device camera to capture a photo of your prescription",
      action: "Open Camera"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App",
      description: "Upload prescriptions through our mobile application",
      action: "Download App"
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email or Fax",
      description: "Send your prescription via email or fax",
      action: "Contact Us"
    }
  ];

  const requirements = [
    "Patient's full name",
    "Prescribing physician's name and contact information",
    "Date of prescription",
    "Medication name and dosage",
    "Quantity prescribed",
    "Directions for use",
    "Physician's signature"
  ];

  return (
    <>
      <SEOHelmet 
        title="Prescription Upload - CureBay Online Pharmacy"
        description="Easily upload your prescriptions to CureBay for fast processing and delivery of your medications."
        keywords="prescription upload, send prescription, digital prescription, pharmacy prescription"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-cyan-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Prescription Upload
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Easily upload your prescriptions for fast processing and delivery of your medications
            </p>
          </div>

          {/* Upload Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors">
              How to Upload Your Prescription
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {methods.map((method, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
                  <div className="text-cyan-600 dark:text-cyan-400 mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                    {method.description}
                  </p>
                  <Button variant="outline" className="w-full transition-colors">
                    {method.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 transition-colors">
              Upload Prescription Directly
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                  file ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-400'
                }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf,.gif"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div>
                    <CheckCircle className="w-16 h-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                      {file.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                      Drag & drop your prescription here
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                      Supported formats: JPG, PNG, PDF, GIF (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
              
              {file && (
                <div className="mt-6">
                  {uploadStatus === 'uploading' ? (
                    <Button className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors" disabled>
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-3"></div>
                        Uploading...
                      </div>
                    </Button>
                  ) : uploadStatus === 'success' ? (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg mb-4 transition-colors">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Prescription uploaded successfully! Our team will process it within 24 hours.
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                      onClick={handleUpload}
                    >
                      Upload Prescription
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8 mb-16 transition-colors">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 transition-colors">
              Prescription Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start p-4 bg-white dark:bg-gray-700 rounded-lg shadow transition-colors">
                  <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors">{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Tips for Clear Prescription Photos
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">1</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 transition-colors">
                    Ensure good lighting to avoid shadows
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">2</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 transition-colors">
                    Place the prescription on a flat, contrasting surface
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">3</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 transition-colors">
                    Make sure all text is legible and not cut off
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">4</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 transition-colors">
                    Include the entire prescription, including the header and footer
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                What Happens Next?
              </h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Review Process</h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Our pharmacists review your prescription for accuracy and completeness.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Verification</h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      We may contact your prescribing physician if we need clarification.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Processing</h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Once verified, we process your order and prepare your medication for delivery.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">4</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Delivery</h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors">
                      Your medication is delivered to your doorstep within 1-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-br from-cyan-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center transition-colors">
            <h2 className="text-3xl font-bold text-white mb-4 transition-colors">
              Need Help with Your Prescription?
            </h2>
            <p className="text-cyan-100 dark:text-gray-200 text-lg mb-6 transition-colors">
              Our pharmacy team is here to assist you with any prescription-related questions
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-medium transition-colors">
                Contact Support
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 py-3 px-6 rounded-lg font-medium transition-colors">
                Call Us: +880 1571151277
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionUploadPage;