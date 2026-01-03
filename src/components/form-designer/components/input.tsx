import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    type ComponentRegistration,
    type InputComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const inputProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '文本输入',
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
        key: 'inputType',
        label: '输入类型',
        type: 'select',
        defaultValue: 'text',
        options: [
            { label: '文本', value: 'text' },
            { label: '邮箱', value: 'email' },
            { label: '密码', value: 'password' },
            { label: '数字', value: 'number' },
            { label: '电话', value: 'tel' },
            { label: '网址', value: 'url' },
        ],
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

function InputRenderer(props: InputComponentProps) {
    const { label, placeholder, inputType, required, disabled, maxLength } = props;

    return (
        <div className="space-y-2">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const inputRegistration: ComponentRegistration = {
    type: 'input',
    category: 'basic',
    name: '文本输入',
    icon: 'TextCursorInput',
    description: '单行文本输入框',
    defaultProps: {
        label: '文本输入',
        placeholder: '请输入...',
        inputType: 'text',
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: inputProperties,
};

registerComponent(inputRegistration, InputRenderer as never);
