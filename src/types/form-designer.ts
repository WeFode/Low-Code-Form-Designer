// ============================================================================
// Low-Code Form Designer - Core Types
// ============================================================================

/**
 * 组件类型枚举
 */
export type ComponentType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'slider'
    | 'date-picker'
    | 'grid';

/**
 * 组件分类
 */
export type ComponentCategory = 'basic' | 'advanced' | 'layout';

/**
 * 属性类型
 */
export type PropertyType = 'string' | 'number' | 'boolean' | 'select' | 'color';

/**
 * 属性定义
 */
export interface PropertyDefinition {
    key: string;
    label: string;
    type: PropertyType;
    defaultValue: unknown;
    options?: { label: string; value: string | number }[]; // for select type
    min?: number; // for number type
    max?: number; // for number type
    step?: number; // for number type
    placeholder?: string;
}

/**
 * 组件通用属性
 */
export interface BaseComponentProps {
    id: string;
    type: ComponentType;
    label: string;
    width: 'full' | '1/2' | '1/3' | '1/4';
    required: boolean;
    disabled: boolean;
    placeholder?: string;
}

/**
 * Input 组件属性
 */
export interface InputComponentProps extends BaseComponentProps {
    type: 'input';
    inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

/**
 * Textarea 组件属性
 */
export interface TextareaComponentProps extends BaseComponentProps {
    type: 'textarea';
    rows: number;
    maxLength?: number;
}

/**
 * Select 组件属性
 */
export interface SelectComponentProps extends BaseComponentProps {
    type: 'select';
    options: { label: string; value: string }[];
    multiple: boolean;
}

/**
 * Checkbox 组件属性
 */
export interface CheckboxComponentProps extends BaseComponentProps {
    type: 'checkbox';
    defaultChecked: boolean;
}

/**
 * Radio 组件属性
 */
export interface RadioComponentProps extends BaseComponentProps {
    type: 'radio';
    options: { label: string; value: string }[];
    orientation: 'horizontal' | 'vertical';
}

/**
 * Switch 组件属性
 */
export interface SwitchComponentProps extends BaseComponentProps {
    type: 'switch';
    defaultChecked: boolean;
}

/**
 * Slider 组件属性
 */
export interface SliderComponentProps extends BaseComponentProps {
    type: 'slider';
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    showValue: boolean;
}

/**
 * DatePicker 组件属性
 */
export interface DatePickerComponentProps extends BaseComponentProps {
    type: 'date-picker';
    format: string;
    showTime: boolean;
}

/**
 * Grid 组件属性
 */
export interface GridComponentProps extends BaseComponentProps {
    type: 'grid';
    columns: number;
    gap: number;
}

/**
 * 所有组件属性联合类型
 */
export type FormComponentProps =
    | InputComponentProps
    | TextareaComponentProps
    | SelectComponentProps
    | CheckboxComponentProps
    | RadioComponentProps
    | SwitchComponentProps
    | SliderComponentProps
    | DatePickerComponentProps
    | GridComponentProps;

/**
 * 组件注册信息
 */
export interface ComponentRegistration {
    type: ComponentType;
    category: ComponentCategory;
    name: string;
    icon: string; // lucide icon name
    description: string;
    defaultProps: Partial<FormComponentProps>;
    properties: PropertyDefinition[];
}

/**
 * 画布中的组件实例
 */
export interface CanvasComponent {
    id: string;
    type: ComponentType;
    props: FormComponentProps;
}

/**
 * 拖拽状态
 */
export interface DragState {
    isDragging: boolean;
    draggedType: ComponentType | null;
    draggedId: string | null; // for reordering
    dropIndex: number | null;
}

/**
 * 表单设计器状态
 */
export interface FormDesignerState {
    components: CanvasComponent[];
    selectedId: string | null;
    dragState: DragState;
}

/**
 * 表单设计器 Actions
 */
export type FormDesignerAction =
    | { type: 'ADD_COMPONENT'; payload: { componentType: ComponentType; index?: number } }
    | { type: 'REMOVE_COMPONENT'; payload: { id: string } }
    | { type: 'SELECT_COMPONENT'; payload: { id: string | null } }
    | { type: 'UPDATE_COMPONENT'; payload: { id: string; props: Partial<FormComponentProps> } }
    | { type: 'REORDER_COMPONENTS'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'SET_DRAG_STATE'; payload: Partial<DragState> }
    | { type: 'CLEAR_CANVAS' };
