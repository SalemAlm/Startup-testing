import { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency } from '@/utils/formatters'
import toast from 'react-hot-toast'

interface ReceiptUploadProps {
  transaction: Transaction
  onClose: () => void
  onSuccess: () => void
}

export default function ReceiptUpload({ transaction, onClose, onSuccess }: ReceiptUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setIsUploading(true)
    try {
      // In a real app, this would upload to a server
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate successful upload
      toast.success('Receipt uploaded successfully!')
      onSuccess()
    } catch (error) {
      toast.error('Failed to upload receipt')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 animate-fadeIn">
      <div className="bg-dark-card rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-slate px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Upload Receipt</h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-navy rounded-lg transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Info */}
          <div className="bg-dark-navy rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Transaction</p>
            <p className="text-white font-semibold mb-1">{transaction.merchant}</p>
            <p className="text-sm text-gray-400 mb-2">{transaction.description}</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(transaction.amount)}</p>
          </div>

          {/* Upload Area */}
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-slate rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-primary" />
              </div>
              <p className="text-white font-semibold mb-2">Upload Receipt</p>
              <p className="text-sm text-gray-400 mb-4">
                Tap to select a photo from your device
              </p>
              <p className="text-xs text-gray-500">Max file size: 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setPreview(null)
                    setFile(null)
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* File Info */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ImageIcon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file?.name}</p>
                  <p className="text-xs text-gray-400">
                    {((file?.size || 0) / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Check size={20} className="text-primary" />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-dark-navy text-white font-semibold py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1 bg-primary text-dark-bg font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
