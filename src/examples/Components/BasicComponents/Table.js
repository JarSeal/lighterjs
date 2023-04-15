import { Component } from '../../../Lighter';

// Common props:
// - heading?: array of objects [
//   { cell: string/template, classes?: string[], id: string }
// ]
// - rows: array of objects [
//   { classes?: string[], id: string, row: [
//      { cell: string/template, classes?: string[], colSpan?: number, id: string }
//   ]}
// ]
// - footer?: array of objects [
//   { cell: string/template, classes?: string[], id: string }
// ]
class Table extends Component {
  constructor(props) {
    super(props);
  }
}

export default Table;
