import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    type ComponentRegistration,
    type SwitchComponentProps,
    type PropertyDefinition,
} from '@/types/form-designer';
import { registerComponent } from './registry';

// ============================================================================
// Properties Definition
// ============================================================================

export const switchProperties: PropertyDefinition[] = [
    {
        key: 'label',
        label: '标签',
        type: 'string',
        defaultValue: '开关',
        placeholder: '请输入标签名称',
    },
    {
        key: 'defaultChecked',
        label: '默认开启',
        type: 'boolean',
        defaultValue: false,
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

function SwitchRenderer(props: SwitchComponentProps) {
    const { label, defaultChecked, required, disabled } = props;

    return (
        <div className="flex items-center justify-between">
            <Label
                htmlFor={props.id}
                className="flex cursor-pointer items-center gap-1"
            >
                {label}
                {required && <span className="text-destructive">*</span>}
            </Label>
            <Switch
                id={props.id}
                defaultChecked={defaultChecked}
                disabled={disabled}
                className="transition-all duration-200"
            />
        </div>
    );
}

// ============================================================================
// Registration
// ============================================================================

const switchRegistration: ComponentRegistration = {
    type: 'switch',
    category: 'basic',
    name: '开关',
    icon: 'ToggleRight',
    description: '开关切换组件',
    defaultProps: {
        label: '开关',
        defaultChecked: false,
        width: 'full',
        required: false,
        disabled: false,
    },
    properties: switchProperties,
};

registerComponent(switchRegistration, SwitchRenderer as never);
