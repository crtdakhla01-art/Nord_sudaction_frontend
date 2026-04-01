import { useState, useEffect } from 'react'

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=23.6848&longitude=-15.9579&current=temperature_2m,wind_speed_10m,weather_code,is_day,relative_humidity_2m&timezone=auto'

function getWeatherInfo(code) {
  if (code === 0) return 'صافٍ'
  if (code <= 3) return 'غائم جزئياً'
  if (code <= 48) return 'ضباب'
  if (code <= 55) return 'رذاذ'
  if (code <= 65) return 'مطر'
  if (code <= 82) return 'زخات مطر'
  return 'عاصفة رعدية'
}

function isRainy(code) {
  return code >= 51
}

function SunCloudSvg({ showRain }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-10 lg:w-20 scale-[110%]">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" y2="28.33" y1="19.67" x2="21.5" x1="16.5" id="b">
          <stop stopColor="#fbbf24" offset="0" />
          <stop stopColor="#fbbf24" offset=".45" />
          <stop stopColor="#f59e0b" offset="1" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="50.8" y1="21.96" x2="39.2" x1="22.56" id="c">
          <stop stopColor="#f3f7fe" offset="0" />
          <stop stopColor="#f3f7fe" offset=".45" />
          <stop stopColor="#deeafb" offset="1" />
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" y2="48.05" y1="42.95" x2="25.47" x1="22.53" id="a">
          <stop stopColor="#4286ee" offset="0" />
          <stop stopColor="#4286ee" offset=".45" />
          <stop stopColor="#0950bc" offset="1" />
        </linearGradient>
      </defs>
      <circle strokeWidth=".5" strokeMiterlimit="10" stroke="#f8af18" fill="url(#b)" r="5" cy="24" cx="19" />
      <path
        d="M19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"
        strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" stroke="#fbbf24" fill="none"
      >
        <animateTransform values="0 19 24; 360 19 24" type="rotate" repeatCount="indefinite" dur="45s" attributeName="transform" />
      </path>
      <path
        d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
        strokeWidth=".5" strokeMiterlimit="10" stroke="#e6effc" fill="url(#c)"
      />
      {showRain && (
        <>
          <path d="M24.39 43.03l-.78 4.94" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" stroke="url(#a)" fill="none">
            <animateTransform values="1 -5; -2 10" type="translate" repeatCount="indefinite" dur="0.7s" attributeName="transform" />
          </path>
          <path d="M31.39 43.03l-.78 4.94" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" stroke="url(#a)" fill="none">
            <animateTransform values="1 -5; -2 10" type="translate" repeatCount="indefinite" dur="0.7s" begin="-0.4s" attributeName="transform" />
          </path>
          <path d="M38.39 43.03l-.78 4.94" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" stroke="url(#a)" fill="none">
            <animateTransform values="1 -5; -2 10" type="translate" repeatCount="indefinite" dur="0.7s" begin="-0.2s" attributeName="transform" />
          </path>
        </>
      )}
    </svg>
  )
}

function DakhlaWeather() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(WEATHER_URL)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json.current)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="font-mono text-primary-500 relative overflow-hidden bg-white w-[120px] h-[80px] rounded-2xl p-3 flex items-center justify-center">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-secondary-400 border-t-transparent" />
      </div>
    )
  }

  if (!data) return null

  const temp = Math.round(data.temperature_2m)
  const wind = Math.round(data.wind_speed_10m)
  const humidity = data.relative_humidity_2m
  const description = getWeatherInfo(data.weather_code)
  const rain = isRainy(data.weather_code)

  return (
    <div className="font-mono text-primary-500 relative overflow-hidden bg-white w-[72px] h-[46px] lg:w-[145px] lg:h-[80px] rounded-xl px-1.5 py-1 lg:px-3 lg:py-2 flex items-center gap-1 lg:gap-2">
      <div className="flex-shrink-0 w-5 lg:w-10">
        <SunCloudSvg showRain={rain} />
      </div>
      <div className="flex flex-col items-center flex-1">
        <h3 className="text-[6px] lg:text-[10px] font-medium">Dakhla</h3>
        <h4 className="font-sans text-base lg:text-2xl font-bold leading-none">
          {temp}°
        </h4>
      </div>
    </div>
  )
}

export default DakhlaWeather
