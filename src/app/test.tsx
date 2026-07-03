import React from 'react';
export default function Test() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-fit h-fit max-w-[95vw] max-h-[90vh] bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10">
        <div className="relative flex items-center justify-center overflow-hidden bg-black">
          <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls className="block max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain"></video>
        </div>
      </div>
    </div>
  )
}
