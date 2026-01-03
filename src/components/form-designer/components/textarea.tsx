import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    type ComponentRegistration,
    type TextareaComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const textareaProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '多行文本',
        placeholder: '请输入标签名称',
    },
    {
        key: 'placeholder',
        label: '占位符',
        type: 'string',
        defaultValue: '',
        placeholder: '请输入占位符文本',
    },
    {
        key: 'rows',
        label: '行数',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 20,
    },
    {
        key: 'width',
        label: '宽度',
        type: 'select',
        defaultValue: 'full',
        options: [
            { label: '100%', value: 'full' },
            { label: '50%', value: '1/2' },
            { label: '33%', value: '1/3' },
            { label: '25%', value: '1/4' },
        ],
    },
    {
        key: 'maxLength',
        label: '最大长度',
        type: 'number',
        defaultValue: undefined,
        min: 0,
        max: 10000,
    },
    {
        key: 'required',
        label: '必填',
        type: 'boolean',
        defaultValue: false,
    },
    {
        key: 'disabled',
        label: '禁用',
        type: 'boolean',
        defaultValue: false,
    },
];

// ============================================================================
// Renderer
// ============================================================================

function TextareaRenderer(props: TextareaComponentProps) {
    const { label, placeholder, rows, required, disabled, maxLength } = props;

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                maxLength={maxLength}
                className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const textareaRegistration: ComponentRegistration = {
    type: 'textarea',
    category: 'basic',
    name: '多行文本',
    icon: 'AlignLeft',
    description: '多行文本输入框',
    defaultProps: {
        label: '多行文本',
        placeholder: '请输入...',
        rows: 3,
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: textareaProperties,
};

registerComponent(textareaRegistration, TextareaRenderer as never);
