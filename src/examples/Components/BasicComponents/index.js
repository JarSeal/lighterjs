import Button from './Button';
import ButtonCode from './Button?raw';
import ButtonExample from './examples/ButtonExample';
import ToolTip from './ToolTip';
import ToolTipCode from './ToolTip?raw';
import ToolTipExample from './examples/ToolTipExample';
import InputText from './InputText';
import InputTextCode from './InputText?raw';
import InputTextExample from './examples/InputTextExample';

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
    id: 'input-text',
    name: 'InputText',
    component: InputText,
    code: InputTextCode,
    examples: InputTextExample,
  },
  // input-number
  // input-textarea
  // input-dropdown
  // input-checkbox
  // input-radiogroup
  // input-draggable-list
  // table
  // table-divs
  // tabs
  // dialog
  // toaster
];

export default { Button };
