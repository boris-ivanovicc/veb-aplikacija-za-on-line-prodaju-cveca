<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <div class="about-hero-matte">
      <div class="layout-container">
        
        <div class="narrative-stack">
          <div class="brand-eyebrow">Belgrade Flower Market</div>
          
          <h1 class="hero-title">
            We curate connections, <br />not just bouquets.
          </h1>
          
          <p class="hero-lead">
            A collective network built to celebrate the raw seasonality of local growth, 
            linking independent Serbian growers with urban spaces.
          </p>

          <div class="manifesto-card-inline">
            <div class="card-indicator"></div>
            <div class="card-body">
              <h3>The Core Manifesto</h3>
              <p>
                No industrial standardizations. Every arrangement tracked through our collective 
                directory retains the distinct stylistic hallmark of its original artist.
              </p>
            </div>
          </div>
        </div>

        <div class="showcase-column">
          <div class="glass-portrait-frame">
            <div class="inner-flower-image"></div>
            <div class="glass-glare-overlay"></div>
          </div>
        </div>

      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.about-hero-matte {
  position: relative;
  min-height: calc(100vh - 53px);
  width: 100%;
  
  background-color: #1a2218; 

  background-image: radial-gradient(
    120% 120% at 20% 0%, 
    rgba(140, 65, 80, 0.5) 0%,
    rgb(51, 62, 47) 40%,
    rgba(26, 34, 24, 0) 90%
  );

  color: #ffffff;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

.layout-container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 5rem;
  align-items: center;
}

.narrative-stack {
  display: flex;
  flex-direction: column;
}

.brand-eyebrow {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #c37286;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 3.8rem;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 1.75rem 0;
}

.hero-lead {
  font-size: 1.25rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 3.5rem 0;
  max-width: 620px;
}

.manifesto-card-inline {
  display: flex;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem;
  border-radius: 12px;
  max-width: 640px;
}

.card-indicator {
  width: 4px;
  background: #c37286;
  border-radius: 2px;
  flex-shrink: 0;
}

.card-body h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #c37286;
}

.card-body p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
}

.showcase-column {
  display: flex;
  justify-content: center;
}

.glass-portrait-frame {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 560px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 1.5rem;
  box-sizing: border-box;
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.inner-flower-image {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background-image: url('https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'); 
  background-size: cover;
  background-position: center;
}

.glass-glare-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border-radius: 24px;
  background: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    transparent 40%, 
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
}

@media (max-width: 1024px) {
  .about-hero-matte {
    padding: 6rem 2rem;
  }
  .layout-container {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  .hero-title {
    font-size: 3rem;
  }
  .hero-lead {
    margin-bottom: 2.5rem;
  }
  .glass-portrait-frame {
    height: 480px;
  }
}
</style>