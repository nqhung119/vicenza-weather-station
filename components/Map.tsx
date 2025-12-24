'use client'

export default function Map() {
  // Coordinates for Vietnam/Vicenza Station area
  // Lat: 19.8067, Lon: 105.7852 (Thanh Hoa)
  const lat = 19.8067
  const lon = 105.7852
  const zoom = 11

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900 border border-white/10">
      <iframe 
        width="100%" 
        height="100%" 
        src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=${zoom}&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
        frameBorder="0"
        className="w-full h-full"
        title="Weather Map"
      ></iframe>
      
      {/* Overlay to keep it looking integrated if needed, or remove if direct interaction preferred.
          Windy iframe is interactive. 
      */}
    </div>
  )
}
