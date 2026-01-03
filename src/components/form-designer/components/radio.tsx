import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    type ComponentRegistration,
    type RadioComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const radioProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '单选组',
        placeholder: '请输入标签名称',
    },
    {
        key: 'orientation',
        label: '排列方向',
        type: 'select',
        defaultValue: 'vertical',
        options: [
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' },
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

function RadioRenderer(props: RadioComponentProps) {
    const { label, options, orientation, required, disabled } = props;

    const displayOptions =
        options && options.length > 0
            ? options
            : [
                { label: '选项 1', value: 'option1' },
                { label: '选项 2', value: 'option2' },
                { label: '选项 3', value: 'option3' },
            ];

    return (
        <div className="space-y-3">
            <Label className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
                disabled={disabled}
                className={
                    orientation === 'horizontal'
                        ? 'flex flex-wrap gap-4'
                        : 'flex flex-col gap-3'
                }
            >
                {displayOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option.value}
                            id={`${props.id}-${option.value}`}
                            className="transition-all duration-200"
                        />
                        <Label
                            htmlFor={`${props.id}-${option.value}`}
                            className="cursor-pointer text-sm font-normal"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const radioRegistration: ComponentRegistration = {
    type: 'radio',
    category: 'basic',
    name: '单选组',
    icon: 'Circle',
    description: '单选按钮组',
    defaultProps: {
        label: '单选组',
        options: [
            { label: '选项 1', value: 'option1' },
            { label: '选项 2', value: 'option2' },
            { label: '选项 3', value: 'option3' },
        ],
        orientation: 'vertical',
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: radioProperties,
};

registerComponent(radioRegistration, RadioRenderer as never);
