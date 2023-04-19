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

export const componentsList = [
  {
    id: 'button',
    name: 'Button',
    component: Button,
    code: ButtonCode,
    examples: ButtonExample,
  },
  {
    id: 'tooltip',
    name: 'ToolTip',
    component: ToolTip,
    code: ToolTipCode,
    examples: ToolTipExample,
  },
  {
    id: 'input-base',
    name: 'InputBase',
    component: InputBase,
    code: InputBaseCode,
    examples: (parent) => {
      parent.add({ attachId: 'examples', text: '[No examples...]' }).draw();
    },
  },
  {
    id: 'input-text',
    name: 'InputText',
    component: InputText,
    code: InputTextCode,
    examples: InputTextExample,
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
    id: 'table',
    name: 'Table',
    component: Table,
    code: TableCode,
    examples: TableExample,
  },
  {
    id: 'dialog',
    name: 'Dialog',
    component: Dialog,
    code: DialogCode,
    examples: DialogExample,
  },
  // collapsable-section
  {
    id: 'collapsapleSection',
    name: 'CollapsableSection',
    component: CollapsableSection,
    code: CollapsableSectionCode,
    examples: CollapsableSectionExample,
  },
  // input-number
  // input-radiogroup
  // input-draggable-list
  // toaster
  // menu-tree
];

export default { Button };
