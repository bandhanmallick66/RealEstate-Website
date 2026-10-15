import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Info, 
  X,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Property } from '../types';

interface VirtualTour360ViewerProps {
  property: Property;
  onCloseTour?: () => void;
}

interface TourRoom {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

interface Hotspot {
  id: string;
  title: string;
  description: string;
  material: string;
  lon: number; // -180 to 180
  lat: number; // -85 to 85
}

export const VirtualTour360Viewer: React.FC<VirtualTour360ViewerProps> = ({
  property,
  onCloseTour
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Tour Rooms Definition
  const rooms: TourRoom[] = [
    {
      id: 'grand-salon',
      name: 'Grand Salon & Atrium',
      subtitle: 'Double-height ceilings with panoramic glass',
      imageUrl: property.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=85',
      hotspots: [
        {
          id: 'hs-1',
          title: 'Floor-to-Ceiling Thermal Glazing',
          description: 'Acoustically damped triple-pane Low-E glass framing continuous vistas.',
          material: 'Schüco Custom Millwork',
          lon: 35,
          lat: 5
        },
        {
          id: 'hs-2',
          title: 'Continuous French White Oak Flooring',
          description: 'Hand-scraped 12-inch wide planks with matte European bio-poly finish.',
          material: 'Arboretum Provenance Timber',
          lon: -40,
          lat: -25
        },
        {
          id: 'hs-3',
          title: 'Integrated Architectural Chandelier',
          description: 'Bespoke hand-blown Bohemian glass with dim-to-warm brass armature.',
          material: 'Ochre Lighting Atelier',
          lon: 0,
          lat: 38
        }
      ]
    },
    {
      id: 'primary-suite',
      name: 'Primary Penthouse Suite',
      subtitle: 'Private wing with custom dressing gallery',
      imageUrl: (property.gallery && property.gallery[1]) || 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2600&q=85',
      hotspots: [
        {
          id: 'hs-4',
          title: 'Bookmatched Calacatta Marble Fireplace',
          description: 'Dual-sided bioethanol ribbon hearth set into monolithic Italian marble slab.',
          material: 'Carrara Pure Calacatta Oro',
          lon: -20,
          lat: -5
        },
        {
          id: 'hs-5',
          title: 'Motorized Blackout Screen Integration',
          description: 'Silent Lutron Palladiom motorized concealment channels.',
          material: 'Lutron Architectural Shades',
          lon: 60,
          lat: 15
        }
      ]
    },
    {
      id: 'culinary-gallery',
      name: "Chef's Culinary Exhibition Gallery",
      subtitle: 'Bespoke minimalist cabinetry & Gaggenau 400 series',
      imageUrl: (property.gallery && property.gallery[2]) || 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2600&q=85',
      hotspots: [
        {
          id: 'hs-6',
          title: 'Monolithic Waterfalled Quartzite Island',
          description: 'Seamless 14-foot prep surface with concealed flush induction cooking.',
          material: 'Brazilian Taj Mahal Quartzite',
          lon: 10,
          lat: -18
        },
        {
          id: 'hs-7',
          title: 'Concealed Chef Appliance Suite',
          description: 'Fully integrated combi-steam ovens, induction cooktops, and 90-bottle wine column.',
          material: 'Gaggenau 400 Series',
          lon: -70,
          lat: 8
        }
      ]
    },
    {
      id: 'horizon-terrace',
      name: 'Infinity Horizon Skydeck',
      subtitle: 'Outdoor lounge with heated infinity pool',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2600&q=85',
      hotspots: [
        {
          id: 'hs-8',
          title: 'Perimeter-Overflow Heated Reflection Pool',
          description: 'Glass-edge cantilevered plunge basin with volcanic basalt copings.',
          material: 'Balinese Honed Basalt',
          lon: 25,
          lat: -15
        },
        {
          id: 'hs-9',
          title: 'Exterior Teak Decking & Marine Audio',
          description: 'Burmese plantation teak with integrated weather-sealed Sonance architectural drivers.',
          material: 'First-Grade Burmese Teak',
          lon: -45,
          lat: -20
        }
      ]
    }
  ];

  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoadingTexture, setIsLoadingTexture] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Interactive camera control coordinates (spherical)
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);

  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);

  const activeRoom = rooms[activeRoomIdx];

  // Load Sphere Panorama Texture
  const loadRoomTexture = useCallback((url: string) => {
    if (!sphereMeshRef.current) return;
    setIsLoadingTexture(true);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          mat.map = texture;
          mat.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      },
      undefined,
      () => {
        // Fallback texture on CORS or network error
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 1024, 512);
          grad.addColorStop(0, '#101319');
          grad.addColorStop(0.5, '#222837');
          grad.addColorStop(1, '#0C0E13');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1024, 512);
          ctx.fillStyle = '#C5A880';
          ctx.font = '24px serif';
          ctx.fillText('Fortvíde Architectural Panorama', 340, 260);
        }
        const fallbackTex = new THREE.CanvasTexture(canvas);
        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          mat.map = fallbackTex;
          mat.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      }
    );
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(72, width / height, 1, 1100);
    cameraRef.current = camera;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert geometry so inside of sphere is visible
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0x111317 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sphereMeshRef.current = mesh;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Initial texture load
    loadRoomTexture(activeRoom.imageUrl);

    // Render loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (isAutoRotating && !isUserInteractingRef.current) {
        lonRef.current += 0.08;
      }

      // Clamp latitude to avoid camera flip
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const targetY = 500 * Math.cos(phiRef.current);
      const targetZ = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(targetX, targetY, targetZ);

      // Normalize heading 0 - 360
      const normHeading = Math.round((lonRef.current % 360 + 360) % 360);
      setCompassHeading(normHeading);

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update texture when room changes
  useEffect(() => {
    loadRoomTexture(activeRoom.imageUrl);
    setSelectedHotspot(null);
  }, [activeRoomIdx, loadRoomTexture, activeRoom.imageUrl]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    const factor = 0.16;
    lonRef.current = (onPointerDownPointerXRef.current - e.clientX) * factor + onPointerDownLonRef.current;
    latRef.current = (e.clientY - onPointerDownPointerYRef.current) * factor + onPointerDownLatRef.current;
  };

  const handlePointerUp = () => {
    isUserInteractingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const fov = cameraRef.current.fov + e.deltaY * 0.05;
    cameraRef.current.fov = THREE.MathUtils.clamp(fov, 35, 95);
    cameraRef.current.updateProjectionMatrix();
  };

  const zoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = Math.max(35, cameraRef.current.fov - 10);
    cameraRef.current.updateProjectionMatrix();
  };

  const zoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = Math.min(95, cameraRef.current.fov + 10);
    cameraRef.current.updateProjectionMatrix();
  };

  const resetView = () => {
    lonRef.current = 0;
    latRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 72;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Jump to specific hotspot view
  const focusOnHotspot = (hs: Hotspot) => {
    lonRef.current = hs.lon;
    latRef.current = hs.lat;
    setSelectedHotspot(hs);
  };

  return (
    <div
      ref={containerRef}
      id="virtual-tour-360-container"
      className="relative w-full aspect-[16/10] sm:aspect-[21/10] bg-[#07080A] rounded-t-2xl overflow-hidden select-none group"
    >
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={canvasContainerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Loading Indicator */}
      {isLoadingTexture && (
        <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A880]/20 border-t-[#C5A880] animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans">
            Loading 360° Interior Space...
          </p>
        </div>
      )}

      {/* Top Header Overlay: Room Title & Badge */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0B0D12]/85 border border-[#C5A880]/40 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#C5A880] uppercase">
            360° VIRTUAL TOUR
          </span>
          <span className="text-[10px] text-[#6E7585]">|</span>
          <span className="text-[11px] font-medium text-[#EDE8DF]">{activeRoom.name}</span>
        </div>
        <p className="text-[10px] text-[#A6ACB8] mt-1 pl-3 font-light drop-shadow">
          {activeRoom.subtitle}
        </p>
      </div>

      {/* Compass / Heading Indicator */}
      <div className="absolute top-3 right-3 z-20 flex items-center space-x-2">
        <div className="px-2.5 py-1 rounded-full bg-[#0B0D12]/85 border border-[#262D3E] backdrop-blur-md flex items-center space-x-1.5 text-[10px] text-[#A6ACB8]">
          <Compass 
            className="w-3.5 h-3.5 text-[#C5A880] transition-transform duration-100" 
            style={{ transform: `rotate(${-compassHeading}deg)` }}
          />
          <span className="font-mono text-[#EDE8DF]">{compassHeading}°</span>
        </div>

        {onCloseTour && (
          <button
            onClick={onCloseTour}
            className="px-2.5 py-1 rounded-full bg-[#0B0D12]/85 hover:bg-[#1A1F2B] border border-[#262D3E] hover:border-[#C5A880] text-[10px] uppercase tracking-wider text-[#EDE8DF] transition-colors"
          >
            Back to Photos
          </button>
        )}
      </div>

      {/* Interactive Architectural Hotspots Drawer / Indicator Button */}
      <div className="absolute left-3 top-20 z-20 flex flex-col space-y-1.5 max-w-[210px]">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold px-2 py-0.5 bg-[#0A0C10]/80 rounded-md backdrop-blur-sm self-start border border-[#C5A880]/20">
          Architectural Features
        </span>
        {activeRoom.hotspots.map((hs) => {
          const isSelected = selectedHotspot?.id === hs.id;
          return (
            <button
              key={hs.id}
              onClick={() => focusOnHotspot(hs)}
              className={`text-left px-2.5 py-1.5 rounded-lg text-[10px] backdrop-blur-md transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-[#C5A880] text-[#0A0C10] font-semibold shadow-[0_0_12px_rgba(197,168,128,0.5)]'
                  : 'bg-[#0E1117]/85 hover:bg-[#171C26] text-[#EDE8DF] border border-[#232938]'
              }`}
            >
              <div className="flex items-center space-x-1.5 truncate mr-1">
                <Sparkles className={`w-3 h-3 shrink-0 ${isSelected ? 'text-[#0A0C10]' : 'text-[#C5A880]'}`} />
                <span className="truncate">{hs.title}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Hotspot Detailed Popover Modal when chosen */}
      {selectedHotspot && (
        <div className="absolute right-3 top-16 z-30 max-w-[280px] bg-[#0E1117]/95 border border-[#C5A880]/50 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl animate-fadeIn">
          <div className="flex items-start justify-between border-b border-[#22293A] pb-2 mb-2">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-semibold">
                Specification Detail
              </span>
              <h4 className="text-xs font-semibold text-[#EDE8DF] leading-tight">
                {selectedHotspot.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-1 text-[#838A9A] hover:text-white rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-[#A6ACB8] leading-relaxed mb-2.5">
            {selectedHotspot.description}
          </p>
          <div className="pt-2 border-t border-[#1C2230] flex items-center justify-between text-[10px]">
            <span className="text-[#6D7484]">Provenance:</span>
            <span className="font-semibold text-[#C5A880]">{selectedHotspot.material}</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Toolbar (Pan, Zoom, Orbit Controls) */}
      <div className="absolute bottom-16 sm:bottom-14 inset-x-0 z-20 flex items-center justify-center pointer-events-none px-4">
        <div className="pointer-events-auto flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#0E1117]/90 border border-[#232938] backdrop-blur-md shadow-2xl text-[#8E95A5]">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-full transition-colors ${
              isAutoRotating ? 'text-[#C5A880] bg-[#C5A880]/15' : 'hover:text-[#EDE8DF]'
            }`}
            title={isAutoRotating ? 'Pause Auto-Orbit' : 'Start Auto-Orbit'}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="w-[1px] h-3 bg-[#242938] mx-0.5" />

          <button
            onClick={zoomIn}
            className="p-1.5 rounded-full hover:text-[#EDE8DF] hover:bg-[#1A1F2C] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={zoomOut}
            className="p-1.5 rounded-full hover:text-[#EDE8DF] hover:bg-[#1A1F2C] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetView}
            className="p-1.5 rounded-full hover:text-[#EDE8DF] hover:bg-[#1A1F2C] transition-colors"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-[#242938] mx-0.5" />

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full hover:text-[#EDE8DF] hover:bg-[#1A1F2C] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Scene / Room Switcher Chips */}
      <div className="absolute bottom-2 inset-x-2 z-20 overflow-x-auto scrollbar-none flex items-center justify-center space-x-1.5 px-2 py-1">
        {rooms.map((room, idx) => {
          const isActive = activeRoomIdx === idx;
          return (
            <button
              key={room.id}
              onClick={() => setActiveRoomIdx(idx)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 backdrop-blur-md shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-[#D0B388] to-[#C5A880] text-[#0A0C10] shadow-[0_0_15px_rgba(197,168,128,0.4)] scale-105'
                  : 'bg-[#0B0E14]/85 hover:bg-[#161B25] text-[#A0A6B5] hover:text-[#EDE8DF] border border-[#232938]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{room.name.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Center Drag Hint Toast (fades out after initial view) */}
      <div className="absolute bottom-24 inset-x-0 z-10 flex justify-center pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] uppercase tracking-[0.25em] text-[#A6ACB8] animate-pulse">
          Click & drag to explore 360° interior
        </span>
      </div>
    </div>
  );
};
