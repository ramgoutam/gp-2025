import { 
  ArrowLeft, Save, Plus, Heading1, Heading2, Type, 
  Link, ListTodo, MessageSquare, LogIn, Layout 
} from "lucide-react";

export const availableComponents = [
  // Text Components
  { type: 'h1', label: 'Heading 1', icon: Heading1, category: 'Text' },
  { type: 'h2', label: 'Heading 2', icon: Heading2, category: 'Text' },
  { type: 'paragraph', label: 'Paragraph', icon: Type, category: 'Text' },
  
  // Input Components
  { type: 'input', label: 'Text Input', icon: Type, category: 'Input' },
  { type: 'textarea', label: 'Text Area', icon: Type, category: 'Input' },
  { type: 'email', label: 'Email Input', icon: Type, category: 'Input' },
  { type: 'phone', label: 'Phone Input', icon: Type, category: 'Input' },
  { type: 'number', label: 'Number Input', icon: Type, category: 'Input' },
  { type: 'date', label: 'Date Picker', icon: Type, category: 'Input' },
  { type: 'file', label: 'File Upload', icon: Type, category: 'Input' },
  
  // Selection Components
  { type: 'checkbox', label: 'Checkbox', icon: ListTodo, category: 'Selection' },
  { type: 'radio', label: 'Radio Group', icon: ListTodo, category: 'Selection' },
  { type: 'select', label: 'Select Dropdown', icon: ListTodo, category: 'Selection' },
  { type: 'toggle', label: 'Toggle Switch', icon: ListTodo, category: 'Selection' },
  
  // Popup Components
  { type: 'popup-sm', label: 'Small Popup (640px)', icon: Layout, category: 'Popups' },
  { type: 'popup-md', label: 'Medium Popup (768px)', icon: Layout, category: 'Popups' },
  { type: 'popup-lg', label: 'Large Popup (1024px)', icon: Layout, category: 'Popups' },
  { type: 'popup-xl', label: 'XL Popup (1280px)', icon: Layout, category: 'Popups' },
  { type: 'popup-2xl', label: '2XL Popup (1536px)', icon: Layout, category: 'Popups' },
  { type: 'popup-custom', label: 'Custom Size Popup', icon: Layout, category: 'Popups' },
  
  // Advanced Components
  { type: 'link', label: 'Link', icon: Link, category: 'Advanced' },
  { type: 'conditional', label: 'Conditional Logic', icon: LogIn, category: 'Advanced' },
];