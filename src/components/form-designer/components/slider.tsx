import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
    type ComponentRegistration,
    type SliderComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const sliderProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '滑块',
        placeholder: '请输入标签名称',
    },
    {
        key: 'min',
        label: '最小值',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 1000,
    },
    {
        key: 'max',
        label: '最大值',
        type: 'number',
        defaultValue: 100,
        min: 1,
        max: 1000,
    },
    {
        key: 'step',
        label: '步长',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 100,
    },
    {
        key: 'defaultValue',
        label: '默认值',
        type: 'number',
        defaultValue: 50,
        min: 0,
        max: 1000,
    },
    {
        key: 'showValue',
        label: '显示数值',
        type: 'boolean',
        defaultValue: true,
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

function SliderRenderer(props: SliderComponentProps) {
    const { label, min, max, step, defaultValue, showValue, required, disabled } =
        props;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>
                {showValue && (
                    <span className="text-sm font-medium text-muted-foreground">
                        {defaultValue}
                    </span>
                )}
            </div>
            <Slider
                defaultValue={[defaultValue]}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className="transition-all duration-200"
            />
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const sliderRegistration: ComponentRegistration = {
    type: 'slider',
    category: 'advanced',
    name: '滑块',
    icon: 'SlidersHorizontal',
    description: '数值滑块组件',
    defaultProps: {
        label: '滑块',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        showValue: true,
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: sliderProperties,
};

registerComponent(sliderRegistration, SliderRenderer as never);
