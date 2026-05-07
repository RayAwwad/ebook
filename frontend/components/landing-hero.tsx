"use client"

import { useState, useEffect, useRef } from "react"
import NextLink from "next/link"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import { ArrowRight, Activity, TrendingUp, Target } from "lucide-react"

const CAROUSEL_URLS = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1920&q=80",
  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=1920&q=80",
]

export function LandingHero() {
  const [current, setCurrent] = useState(0)
  const preloaded = useRef(false)

  useEffect(() => {
    if (preloaded.current) return
    preloaded.current = true
    CAROUSEL_URLS.forEach((url) => {
      const img = new window.Image()
      img.src = url
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_URLS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background carousel images */}
      {CAROUSEL_URLS.map((url, i) => (
        <Box
          key={url}
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${url}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease",
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.55)", zIndex: 1 }} />

      {/* Carousel dots */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 3,
        }}
      >
        {CAROUSEL_URLS.map((_, i) => (
          <Box
            component="button"
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            sx={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              bgcolor: i === current ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "all 0.3s ease",
              p: 0,
            }}
          />
        ))}
      </Box>

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 900,
          mx: "auto",
          px: 3,
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              display: "flex",
            }}
          >
            <Activity size={22} color="#fff" />
          </Box>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, letterSpacing: "-0.02em" }}>
            ebook
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.2rem", md: "3.5rem", lg: "4.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fff",
            mb: 2,
            lineHeight: 1.1,
          }}
        >
          Transform Your Body.
          <br />
          <Box component="span" sx={{ opacity: 0.88 }}>
            Unlock Your Potential.
          </Box>
        </Typography>

        {/* Subheadline */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.78)",
            maxWidth: 620,
            mb: 5,
            lineHeight: 1.6,
            fontWeight: 400,
            fontSize: { xs: "1rem", md: "1.15rem" },
          }}
        >
          Discover how your fitness metrics compare to others like you. Get personalized insights
          and a detailed PDF report to guide your transformation journey.
        </Typography>

        {/* CTA */}
        <NextLink href="/form" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowRight size={20} />}
            sx={{
              bgcolor: "#fff",
              color: "#111",
              borderRadius: 99,
              px: 4,
              py: 1.5,
              fontSize: "1.05rem",
              fontWeight: 600,
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)", transform: "scale(1.04)" },
              transition: "all 0.25s ease",
            }}
          >
            Get Started
          </Button>
        </NextLink>

        {/* Features grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            mt: 10,
            width: "100%",
            maxWidth: 760,
          }}
        >
          <FeatureCard
            icon={<TrendingUp size={20} />}
            title="Compare Metrics"
            description="See how you stack up against people with similar profiles"
          />
          <FeatureCard
            icon={<Target size={20} />}
            title="Set Goals"
            description="Understand your ideal weight range based on real data"
          />
          <FeatureCard
            icon={<Activity size={20} />}
            title="Track Progress"
            description="Download your personalized report and track changes"
          />
        </Box>
      </Box>
    </Box>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.1)",
          color: "#fff",
          mb: 2,
          display: "flex",
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff", mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", textAlign: "center" }}>
        {description}
      </Typography>
    </Box>
  )
}
