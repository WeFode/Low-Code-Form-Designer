import { useRef, useState } from 'react';
import { useStore } from 'zustand';
import {
    Trash2,
    Code,
    Eye,
    Undo2,
    Redo2,
    Download,
    Upload,
    EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    useFormDesignerStore,
    useComponents,
    useIsPreviewMode,
    useTemporalStore,
} from '@/store/form-designer-store';
import { ComponentPalette } from './ComponentPalette';
import { DesignerCanvas } from './DesignerCanvas';
import { PropertyEditor } from './PropertyEditor';

// Use proper shadcn dialoag
import {
    Dialog as ShadDialog,
    DialogContent as ShadDialogContent,
    DialogDescription as ShadDialogDescription,
    DialogHeader as ShadDialogHeader,
    DialogTitle as ShadDialogTitle,
} from '@/components/ui/dialog';

// ============================================================================
// Toolbar
// ============================================================================

function Toolbar() {
    const components = useComponents();
    const isPreviewMode = useIsPreviewMode();

    const clearCanvas = useFormDesignerStore((state) => state.clearCanvas);
    const exportToJSON = useFormDesignerStore((state) => state.exportToJSON);
    const importFromJSON = useFormDesignerStore((state) => state.importFromJSON);
    const setPreviewMode = useFormDesignerStore((state) => state.setPreviewMode);

    const temporalStore = useTemporalStore();
    const { undo, redo, pastStates, futureStates } = useStore(temporalStore);

    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importJSON, setImportJSON] = useState('');
    const [importError, setImportError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    const handleClear = () => {
        if (components.length === 0) return;
        if (confirm('确定要清空画布吗？此操作可以撤销。')) {
            clearCanvas();
        }
    };

    const handleExport = () => {
        const json = exportToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `form-design-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportSubmit = () => {
        setImportError('');
        if (!importJSON.trim()) {
            setImportError('请输入 JSON 内容');
            return;
        }
        const success = importFromJSON(importJSON);
        if (success) {
            setShowImportDialog(false);
            setImportJSON('');
        } else {
            setImportError('JSON 格式无效，请检查内容');
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setImportJSON(content);
            setShowImportDialog(true);
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <>
            <div className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-md">
                        <Code className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold">低代码表单设计器</h1>
                        <p className="text-xs text-muted-foreground">
                            拖拽组件快速构建表单
                        </p>
                    </div>
                </div>

                {/* Center: Undo/Redo */}
                <div className="flex items-center gap-1">
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => undo()}
                                    disabled={!canUndo}
                                >
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>撤销 (Ctrl+Z)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => redo()}
                                    disabled={!canRedo}
                                >
                                    <Redo2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>重做 (Ctrl+Shift+Z)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isPreviewMode ? 'default' : 'outline'}
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setPreviewMode(!isPreviewMode)}
                                >
                                    {isPreviewMode ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            退出预览
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            预览
                                        </>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{isPreviewMode ? '返回编辑模式' : '预览表单效果'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="h-6" />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileImport}
                    />
                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>导入 JSON</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleExport}
                                    disabled={components.length === 0}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>导出 JSON</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="h-6" />

                    <TooltipProvider delayDuration={300}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={handleClear}
                                    disabled={components.length === 0}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>清空画布</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="h-6" />

                    <ThemeToggle />
                </div>
            </div>

            {/* Import Dialog */}
            <ShadDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <ShadDialogContent className="sm:max-w-2xl">
                    <ShadDialogHeader>
                        <ShadDialogTitle>导入表单配置</ShadDialogTitle>
                        <ShadDialogDescription>
                            粘贴或编辑 JSON 配置来导入表单
                        </ShadDialogDescription>
                    </ShadDialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            value={importJSON}
                            onChange={(e) => {
                                setImportJSON(e.target.value);
                                setImportError('');
                            }}
                            placeholder='{"components": [...]}'
                            className="h-64 font-mono text-sm"
                        />
                        {importError && (
                            <p className="text-sm text-destructive">{importError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowImportDialog(false)}
                            >
                                取消
                            </Button>
                            <Button onClick={handleImportSubmit}>导入</Button>
                        </div>
                    </div>
                </ShadDialogContent>
            </ShadDialog>
        </>
    );
}

// ============================================================================
// Form Designer Layout
// ============================================================================

function FormDesignerLayout() {
    const isPreviewMode = useIsPreviewMode();

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            {/* Toolbar */}
            <Toolbar />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Panel: Component Palette (hidden in preview) */}
                {!isPreviewMode && <ComponentPalette />}

                {/* Center: Designer Canvas */}
                <DesignerCanvas />

                {/* Right Panel: Property Editor (hidden in preview) */}
                {!isPreviewMode && <PropertyEditor />}
            </div>
        </div>
    );
}

// ============================================================================
// Form Designer
// ============================================================================

export function FormDesigner() {
    return <FormDesignerLayout />;
}

export default FormDesigner;
