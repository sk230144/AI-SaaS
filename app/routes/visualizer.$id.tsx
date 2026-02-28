import { useNavigate, useOutletContext, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { generate3DView, generate3DViewEdited } from "../../lib/ai.action";
import {
    Box, Check, Download, Link2, RefreshCcw, Share2, X,
    Move, Replace, Trash2, Palette, RotateCcw, ChevronRight, SlidersHorizontal
} from "lucide-react";
import Button from "../../components/ui/Button";
import { createProject, getProjectById } from "../../lib/puter.action";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import {
    buildMovePrompt, buildReplacePrompt, buildRemovePrompt, buildStyleSwitchPrompt,
    type EditMode, type FurnitureObject, type FurnitureStyle, type RoomStyle,
} from "../../lib/constants";

const FURNITURE_OBJECTS: { value: FurnitureObject; label: string }[] = [
    { value: 'bed', label: 'Bed' },
    { value: 'sofa', label: 'Sofa' },
    { value: 'dining table', label: 'Dining Table' },
    { value: 'desk', label: 'Desk' },
    { value: 'wardrobe', label: 'Wardrobe' },
    { value: 'coffee table', label: 'Coffee Table' },
    { value: 'tv unit', label: 'TV Unit' },
    { value: 'bookshelf', label: 'Bookshelf' },
    { value: 'kitchen counter', label: 'Kitchen Counter' },
    { value: 'bathtub', label: 'Bathtub' },
    { value: 'toilet', label: 'Toilet' },
    { value: 'sink', label: 'Sink' },
];

const FURNITURE_STYLES: { value: FurnitureStyle; label: string; desc: string }[] = [
    { value: 'Modern', label: 'Modern', desc: 'Clean lines, neutral tones' },
    { value: 'Minimal', label: 'Minimal', desc: 'Ultra-simple, no decoration' },
    { value: 'Luxury', label: 'Luxury', desc: 'Rich materials, premium finish' },
    { value: 'Classic', label: 'Classic', desc: 'Timeless, warm wood tones' },
];

const ROOM_STYLES: { value: RoomStyle; label: string; desc: string }[] = [
    { value: 'Modern', label: 'Modern', desc: 'Sleek & contemporary' },
    { value: 'Scandinavian', label: 'Scandinavian', desc: 'Light oak, hygge warmth' },
    { value: 'Luxury', label: 'Luxury', desc: 'Marble, brass, velvet' },
    { value: 'Minimal', label: 'Minimal', desc: 'Maximum negative space' },
    { value: 'Contemporary', label: 'Contemporary', desc: 'Bold accents, mixed materials' },
];

const VisualizerId = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useOutletContext<AuthContext>();

    const hasInitialGenerated = useRef(false);
    const shareRef = useRef<HTMLDivElement>(null);

    const [project, setProject] = useState<DesignItem | null>(null);
    const [isProjectLoading, setIsProjectLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    // Edit history for undo
    const [imageHistory, setImageHistory] = useState<string[]>([]);

    // Share state
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Sidebar collapse (for tablet & mobile)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Edit panel state
    const [editMode, setEditMode] = useState<EditMode>(null);
    const [selectedObject, setSelectedObject] = useState<FurnitureObject>('bed');
    const [selectedFurnitureStyle, setSelectedFurnitureStyle] = useState<FurnitureStyle>('Modern');
    const [selectedRoomStyle, setSelectedRoomStyle] = useState<RoomStyle>('Modern');
    const [editError, setEditError] = useState<string | null>(null);

    const handleBack = () => navigate('/');

    const handleExport = () => {
        if (!currentImage) return;
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `roomify-${id || 'design'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getShareUrl = () => {
        if (project?.renderedImage) return project.renderedImage;
        if (currentImage) return currentImage;
        return window.location.href;
    };

    const handleShareWhatsApp = () => {
        const url = getShareUrl();
        const text = `Check out this AI-generated 3D design by Roomify! 🏠✨\n${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        setShowShareMenu(false);
    };

    const handleCopyLink = async () => {
        const url = getShareUrl();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 1500);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 1500);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const runGeneration = async (item: DesignItem) => {
        if (!id || !item.sourceImage) return;
        try {
            setIsProcessing(true);
            const result = await generate3DView({ sourceImage: item.sourceImage });

            if (result.renderedImage) {
                setCurrentImage(result.renderedImage);

                const updatedItem = {
                    ...item,
                    renderedImage: result.renderedImage,
                    renderedPath: result.renderedPath,
                    timestamp: Date.now(),
                    ownerId: item.ownerId ?? userId ?? null,
                    isPublic: item.isPublic ?? false,
                };

                const saved = await createProject({ item: updatedItem, visibility: "private" });
                if (saved) {
                    setProject(saved);
                    setCurrentImage(saved.renderedImage || result.renderedImage);
                }
            }
        } catch (error) {
            console.error('Generation failed: ', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyEdit = async () => {
        if (!project?.sourceImage || !currentImage || !editMode) return;

        setEditError(null);

        let editPrompt = '';
        if (editMode === 'move') editPrompt = buildMovePrompt(selectedObject);
        else if (editMode === 'replace') editPrompt = buildReplacePrompt(selectedObject, selectedFurnitureStyle);
        else if (editMode === 'remove') editPrompt = buildRemovePrompt(selectedObject);
        else if (editMode === 'style') editPrompt = buildStyleSwitchPrompt(selectedRoomStyle);

        try {
            setIsProcessing(true);
            setImageHistory(prev => [...prev, currentImage]);

            const result = await generate3DViewEdited({
                sourceImage: project.sourceImage,
                currentRender: currentImage,
                editPrompt,
            });

            if (result.renderedImage) {
                setCurrentImage(result.renderedImage);

                const updatedItem = {
                    ...project,
                    renderedImage: result.renderedImage,
                    timestamp: Date.now(),
                    ownerId: project.ownerId ?? userId ?? null,
                    isPublic: project.isPublic ?? false,
                };

                const saved = await createProject({ item: updatedItem, visibility: "private" });
                if (saved) setProject(saved);
            } else {
                setEditError('Generation returned no image. Please try again.');
                setImageHistory(prev => prev.slice(0, -1));
            }
        } catch (error) {
            console.error('Edit generation failed:', error);
            setEditError('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUndo = () => {
        if (imageHistory.length === 0) return;
        setCurrentImage(imageHistory[imageHistory.length - 1]);
        setImageHistory(h => h.slice(0, -1));
    };

    const handleSelectMode = (mode: EditMode) => {
        setEditMode(prev => prev === mode ? null : mode);
        setEditError(null);
    };

    useEffect(() => {
        let isMounted = true;

        const loadProject = async () => {
            if (!id) { setIsProjectLoading(false); return; }

            setIsProjectLoading(true);
            const fetchedProject = await getProjectById({ id });

            if (!isMounted) return;

            setProject(fetchedProject);
            setCurrentImage(fetchedProject?.renderedImage || null);
            setIsProjectLoading(false);
            hasInitialGenerated.current = false;
        };

        loadProject();
        return () => { isMounted = false; };
    }, [id]);

    useEffect(() => {
        if (isProjectLoading || hasInitialGenerated.current || !project?.sourceImage) return;

        if (project.renderedImage) {
            setCurrentImage(project.renderedImage);
            hasInitialGenerated.current = true;
            return;
        }

        hasInitialGenerated.current = true;
        void runGeneration(project);
    }, [project, isProjectLoading]);

    const renderEditSubPanel = () => {
        if (!editMode) return null;

        return (
            <div className="edit-subpanel">
                {(editMode === 'move' || editMode === 'replace' || editMode === 'remove') && (
                    <div className="subpanel-section">
                        <label className="subpanel-label">Select Furniture</label>
                        <div className="object-grid">
                            {FURNITURE_OBJECTS.map(obj => (
                                <button
                                    key={obj.value}
                                    className={`object-chip ${selectedObject === obj.value ? 'active' : ''}`}
                                    onClick={() => setSelectedObject(obj.value)}
                                >
                                    {obj.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {editMode === 'replace' && (
                    <div className="subpanel-section">
                        <label className="subpanel-label">Replacement Style</label>
                        <div className="style-list">
                            {FURNITURE_STYLES.map(s => (
                                <button
                                    key={s.value}
                                    className={`style-option ${selectedFurnitureStyle === s.value ? 'active' : ''}`}
                                    onClick={() => setSelectedFurnitureStyle(s.value)}
                                >
                                    <span className="style-name">{s.label}</span>
                                    <span className="style-desc">{s.desc}</span>
                                    {selectedFurnitureStyle === s.value && <Check size={14} className="style-check" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {editMode === 'style' && (
                    <div className="subpanel-section">
                        <label className="subpanel-label">Room Style Preset</label>
                        <div className="style-list">
                            {ROOM_STYLES.map(s => (
                                <button
                                    key={s.value}
                                    className={`style-option ${selectedRoomStyle === s.value ? 'active' : ''}`}
                                    onClick={() => setSelectedRoomStyle(s.value)}
                                >
                                    <span className="style-name">{s.label}</span>
                                    <span className="style-desc">{s.desc}</span>
                                    {selectedRoomStyle === s.value && <Check size={14} className="style-check" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {editError && <p className="edit-error">{editError}</p>}

                <button
                    className="apply-btn"
                    onClick={handleApplyEdit}
                    disabled={isProcessing || !currentImage}
                >
                    {isProcessing
                        ? <><RefreshCcw size={14} className="animate-spin mr-2" />Generating...</>
                        : <><ChevronRight size={14} className="mr-1" />Apply</>
                    }
                </button>
            </div>
        );
    };

    return (
        <div className="visualizer">

            {/* ── Topbar ── */}
            <nav className="topbar">
                <div className="brand">
                    <Box className="logo" />
                    <span className="name">Roomify</span>
                </div>

                <div className="topbar-right">
                    {/* Sidebar toggle — visible on tablet & mobile */}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(o => !o)}
                        aria-label="Toggle edit controls"
                    >
                        <SlidersHorizontal size={16} />
                        <span>Edit Controls</span>
                    </button>

                    <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
                        <X className="icon" /> Exit Editor
                    </Button>
                </div>
            </nav>

            {/* ── Body: sidebar + main content ── */}
            <div className="viz-body">

                {/* ── Sidebar overlay backdrop (mobile/tablet) ── */}
                {sidebarOpen && (
                    <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
                )}

                {/* ── Edit Sidebar ── */}
                <aside className={`edit-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="edit-panel-header">
                        <div>
                            <p className="edit-panel-title">Edit Controls</p>
                            <p className="edit-panel-sub">Select an action below</p>
                        </div>
                        {/* Close button — visible on mobile/tablet */}
                        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                            <X size={16} />
                        </button>
                    </div>

                    <div className="edit-actions">
                        <button
                            className={`edit-action-btn ${editMode === 'move' ? 'active' : ''}`}
                            onClick={() => handleSelectMode('move')}
                        >
                            <Move size={16} />
                            <span>Move Object</span>
                        </button>
                        <button
                            className={`edit-action-btn ${editMode === 'replace' ? 'active' : ''}`}
                            onClick={() => handleSelectMode('replace')}
                        >
                            <Replace size={16} />
                            <span>Replace Object</span>
                        </button>
                        <button
                            className={`edit-action-btn ${editMode === 'remove' ? 'active' : ''}`}
                            onClick={() => handleSelectMode('remove')}
                        >
                            <Trash2 size={16} />
                            <span>Remove Object</span>
                        </button>
                        <button
                            className={`edit-action-btn ${editMode === 'style' ? 'active' : ''}`}
                            onClick={() => handleSelectMode('style')}
                        >
                            <Palette size={16} />
                            <span>Style Switch</span>
                        </button>
                    </div>

                    {renderEditSubPanel()}

                    {imageHistory.length > 0 && (
                        <button className="undo-btn" onClick={handleUndo} disabled={isProcessing}>
                            <RotateCcw size={14} className="mr-1" />
                            Undo Last Edit
                        </button>
                    )}
                </aside>

                {/* ── Main content: render + compare stacked ── */}
                <div className="viz-main">

                    {/* Render panel */}
                    <div className="panel">
                        <div className="panel-header">
                            <div className="panel-meta">
                                <p>Project</p>
                                <h2>{project?.name || `Residence ${id}`}</h2>
                                <p className="note">Created by You</p>
                            </div>

                            <div className="panel-actions">
                                <Button
                                    size="sm"
                                    onClick={handleExport}
                                    className="export"
                                    disabled={!currentImage}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Export
                                </Button>
                                <div className="share-wrapper" ref={shareRef}>
                                    <Button
                                        size="sm"
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="share"
                                        disabled={!currentImage}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>

                                    {showShareMenu && (
                                        <div className="share-dropdown">
                                            <button className="share-option" onClick={handleShareWhatsApp}>
                                                <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                <span>WhatsApp</span>
                                            </button>
                                            <button className="share-option" onClick={handleCopyLink}>
                                                {copied ? (
                                                    <><Check size={18} className="text-green-500" /><span className="text-green-500">Copied!</span></>
                                                ) : (
                                                    <><Link2 size={18} /><span>Copy Link</span></>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`render-area ${isProcessing ? 'is-processing' : ''}`}>
                            {currentImage ? (
                                <img src={currentImage} alt="AI Render" className="render-img" />
                            ) : (
                                <div className="render-placeholder">
                                    {project?.sourceImage && (
                                        <img src={project?.sourceImage} alt="Original" className="render-fallback" />
                                    )}
                                </div>
                            )}

                            {isProcessing && (
                                <div className="render-overlay">
                                    <div className="rendering-card">
                                        <RefreshCcw className="spinner" />
                                        <span className="title">Rendering...</span>
                                        <span className="subtitle">Applying your edit</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compare panel */}
                    <div className="panel compare">
                        <div className="panel-header">
                            <div className="panel-meta">
                                <p>Comparison</p>
                                <h3>Before and After</h3>
                            </div>
                            <div className="hint">Drag to compare</div>
                        </div>

                        <div className="compare-stage">
                            {project?.sourceImage && currentImage ? (
                                <ReactCompareSlider
                                    defaultValue={50}
                                    style={{ width: '100%', height: '100%' }}
                                    itemOne={
                                        <ReactCompareSliderImage src={project?.sourceImage} alt="before" className="compare-img" />
                                    }
                                    itemTwo={
                                        <ReactCompareSliderImage src={currentImage ?? project?.renderedImage ?? undefined} alt="after" className="compare-img" />
                                    }
                                />
                            ) : (
                                <div className="compare-fallback">
                                    {project?.sourceImage && (
                                        <img src={project.sourceImage} alt="Before" className="compare-img" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VisualizerId;
