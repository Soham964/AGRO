import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const categories = [
  { value: "grains", label: "Grains" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "spices", label: "Spices" },
  { value: "oils", label: "Oils" },
  { value: "others", label: "Others" },
];

const ListProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    info: "",
    image: undefined as File | undefined,
    category: "grains",
  });
  const [imageError, setImageError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>("environment");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "image" && files && files[0]) {
      if (files[0].size > 10 * 1024 * 1024) {
        setImageError("Image size must be less than 10MB");
        return;
      }
      setImageError("");
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Camera logic
  const openCamera = () => {
    setShowCamera(true);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        streamRef.current = stream;
      } catch (err) {
        setImageError("Unable to access camera");
        setShowCamera(false);
      }
    }, 100);
  };

  const closeCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = () => {
    setCameraFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    closeCamera();
    setTimeout(openCamera, 200); // restart camera with new facing mode
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured.jpg", { type: "image/jpeg" });
          setForm((prev) => ({ ...prev, image: file }));
          setImageError("");
          closeCamera();
        }
      }, "image/jpeg", 0.95);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    alert("Product submitted! (API integration pending)");
    navigate("/seller/my-products");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-8 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">List a New Product</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium mb-2 text-green-900">Product Name</label>
            <Input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Basmati Rice" className="h-12 text-base" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2 text-green-900">Price (₹)</label>
            <Input name="price" value={form.price} onChange={handleChange} required type="number" min="0" step="0.01" placeholder="e.g. 85" className="h-12 text-base" />
          </div>
          <div>
            <label className="block text-base font-medium mb-2 text-green-900">Product Info</label>
            <textarea name="info" value={form.info} onChange={handleChange} required className="w-full border rounded-lg p-3 min-h-[80px] text-base focus:outline-none focus:ring-2 focus:ring-green-200" placeholder="Describe your product..." />
          </div>
          <div>
            <label className="block text-base font-medium mb-2 text-green-900">Product Image (max 10MB)</label>
            <div className="flex gap-2 items-center">
              <Input name="image" type="file" accept="image/*" onChange={handleChange} className="flex-1 h-12 text-base" />
              <Button type="button" variant="outline" onClick={openCamera} className="whitespace-nowrap h-12 px-4">Take Photo</Button>
            </div>
            {form.image && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">Selected: {form.image.name}</span>
              </div>
            )}
            {imageError && <div className="text-red-500 text-xs mt-1">{imageError}</div>}
            <div className="text-xs text-muted-foreground mt-1">You can choose a file or take a photo directly.</div>
            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-2xl shadow-lg p-6 relative w-full max-w-md flex flex-col items-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded mb-4 bg-black" style={{ maxHeight: 320 }} />
                  <div className="flex gap-2 mb-4">
                    <Button type="button" onClick={capturePhoto} className="h-10 px-6">Capture</Button>
                    <Button type="button" variant="outline" onClick={switchCamera} className="h-10 px-6">Switch Camera</Button>
                    <Button type="button" variant="destructive" onClick={closeCamera} className="h-10 px-6">Cancel</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{cameraFacingMode === 'environment' ? 'Back Camera' : 'Front Camera'}</div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-base font-medium mb-2 text-green-900">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-green-200">
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold bg-green-500 hover:bg-green-600 rounded-lg mt-2">Submit Product</Button>
        </form>
      </div>
    </div>
  );
};

export default ListProduct;
