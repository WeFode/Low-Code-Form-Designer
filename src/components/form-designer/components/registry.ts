import { type ReactNode } from 'react';
import {
    type ComponentType,
    type ComponentCategory,
    type ComponentRegistration,
    type FormComponentProps,
} from '@/types/form-designer';

// ============================================================================
// Component Registry - Core (no imports of component files here)
// ============================================================================

const componentRegistry = new Map<ComponentType, ComponentRegistration>();
const componentRenderers = new Map<
    ComponentType,
    (props: FormComponentProps) => ReactNode
>();

/**
 * 注册组件
 */
export function registerComponent(
    registration: ComponentRegistration,
    renderer: (props: FormComponentProps) => ReactNode
): void {
    componentRegistry.set(registration.type, registration);
    componentRenderers.set(registration.type, renderer);
}

/**
 * 获取组件注册信息
 */
export function getComponentRegistration(
    type: ComponentType
): ComponentRegistration | undefined {
    return componentRegistry.get(type);
}

/**
 * 获取组件渲染器
 */
export function getComponentRenderer(
    type: ComponentType
): ((props: FormComponentProps) => ReactNode) | undefined {
    return componentRenderers.get(type);
}

/**
 * 获取所有已注册组件
 */
export function getAllComponents(): ComponentRegistration[] {
    return Array.from(componentRegistry.values());
}

/**
 * 按分类获取组件
 */
export function getComponentsByCategory(
    category: ComponentCategory
): ComponentRegistration[] {
    return getAllComponents().filter((c) => c.category === category);
}

/**
 * 获取所有分类
 */
export function getAllCategories(): {
    id: ComponentCategory;
    name: string;
    icon: string;
}[] {
    return [
        { id: 'basic', name: '基础组件', icon: 'LayoutGrid' },
        { id: 'advanced', name: '高级组件', icon: 'Sparkles' },
    ];
}
