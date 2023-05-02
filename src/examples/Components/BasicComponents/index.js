import Button from './Button';
import ButtonCode from './Button?raw';
import ButtonExample from './examples/ButtonExample';
import ToolTip from './ToolTip';
import ToolTipCode from './ToolTip?raw';
import ToolTipExample from './examples/ToolTipExample';
import InputBase from './InputBase';
import InputBaseCode from './InputBase?raw';
import InputText from './InputText';
import InputTextCode from './InputText?raw';
import InputTextExample from './examples/InputTextExample';
import InputCheckbox from './InputCheckbox';
import InputCheckboxCode from './InputCheckbox?raw';
import InputCheckboxExample from './examples/InputCheckboxExample';
import InputDropdown from './InputDropdown';
import InputDropdownCode from './InputDropdown?raw';
import InputDropdownExample from './examples/InputDropdownExample';
import Table from './Table';
import TableCode from './Table?raw';
import TableExample from './examples/TableExample';
import Dialog from './Dialog';
import DialogCode from './Dialog?raw';
import DialogExample from './examples/DialogExample';
import CollapsableSection from './CollapsableSection';
import CollapsableSectionCode from './CollapsableSection?raw';
import CollapsableSectionExample from './examples/CollapsableSectionExample';
import InputRadioGroup from './InputRadioGroup';
import InputRadioGroupCode from './InputRadioGroup?raw';
import InputRadioGroupExample from './examples/InputRadioGroupExample';
import MenuTree from './MenuTree';
import MenuTreeCode from './MenuTree?raw';
import MenuTreeExample from './examples/MenuTreeExample';
import InputNumber from './InputNumber';
import InputNumberCode from './InputNumber?raw';
import InputNumberExample from './examples/InputNumberExample';
import Toaster from './Toaster';
import ToasterCode from './Toaster?raw';
import ToasterExample from './examples/ToasterExample';

export const componentsList = [
  {
    id: 'button',
    name: 'Button',
    component: Button,
    code: ButtonCode,
    examples: ButtonExample,
  },
  {
    id: 'collapsapleSection',
    name: 'CollapsableSection',
    component: CollapsableSection,
    code: CollapsableSectionCode,
    examples: CollapsableSectionExample,
  },
  {
    id: 'dialog',
    name: 'Dialog',
    component: Dialog,
    code: DialogCode,
    examples: DialogExample,
  },
  {
    id: 'input-base',
    name: 'InputBase',
    description: 'Base class for all input components. Needed for all Input* classes.',
    component: InputBase,
    code: InputBaseCode,
  },
  {
    id: 'input-checkbox',
    name: 'InputCheckbox',
    component: InputCheckbox,
    code: InputCheckboxCode,
    examples: InputCheckboxExample,
  },
  {
    id: 'input-dropdown',
    name: 'InputDropdown',
    component: InputDropdown,
    code: InputDropdownCode,
    examples: InputDropdownExample,
  },
  {
    id: 'input-number',
    name: 'InputNumber',
    component: InputNumber,
    code: InputNumberCode,
    examples: InputNumberExample,
  },
  {
    id: 'input-radiogroup',
    name: 'InputRadioGroup',
    component: InputRadioGroup,
    code: InputRadioGroupCode,
    examples: InputRadioGroupExample,
  },
  {
    id: 'input-text',
    name: 'InputText',
    component: InputText,
    code: InputTextCode,
    examples: InputTextExample,
  },
  {
    id: 'menutree',
    name: 'MenuTree',
    component: MenuTree,
    code: MenuTreeCode,
    examples: MenuTreeExample,
  },
  {
    id: 'table',
    name: 'Table',
    component: Table,
    code: TableCode,
    examples: TableExample,
  },
  {
    id: 'toaster',
    name: 'Toaster',
    component: Toaster,
    code: ToasterCode,
    examples: ToasterExample,
  },
  {
    id: 'tooltip',
    name: 'ToolTip',
    component: ToolTip,
    code: ToolTipCode,
    examples: ToolTipExample,
  },
  // input-draggable-list
  // toaster
];
