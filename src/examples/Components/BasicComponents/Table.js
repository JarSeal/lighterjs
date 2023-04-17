import { Component } from '../../../Lighter';

// Common props:
// - headings?: array of objects
// - rows: array of objects
// - footers?: array of objects
// For headings, rows, and footers, the data can be in two different formats (headings has always th cell tags):
// A (simple): [
//   { cell: string/template, classes?: string[], id?: string, isTh?: boolean }
// ]
// B (for giving the row properties): [
//   { classes?: string[], id?: string, row: [
//      { cell: string/template, classes?: string[], colSpan?: number, rowSpan?: number, id?: string, isTh?: boolean }
//   ]}
// ]
class Table extends Component {
  constructor(props) {
    super(props);
    this.headings = props.headings || null;
    this.rows = props.rows || null;
    this.footers = props.footers || null;
    this.headingsRowsFound = false;
    this.rowsRowsFound = false;
    this.footersRowsFound = false;
    this.columnCount = this._getMaxColumn();
    this.props.template = `<div class="tableOuter">
      <table${props.alignTextLeft ? ' style="text-align: left;"' : ''}>
        ${this._createSection('headings')}
        ${this._createSection('rows')}
        ${this._createSection('footers')}
      </table>
    </div>`;
  }

  _createSection = (section) => {
    let data = null,
      sectionTagStart = '',
      sectionTagEnd = '',
      rowsFound = false;
    switch (section) {
      case 'headings':
        data = this.headings;
        sectionTagStart = '<thead>';
        sectionTagEnd = '</thead>';
        rowsFound = this.headingsRowsFound;
        break;
      case 'rows':
        data = this.rows;
        sectionTagStart = '<tbody>';
        sectionTagEnd = '</tbody>';
        rowsFound = this.rowsRowsFound;
        break;
      case 'footers':
        data = this.footers;
        sectionTagStart = '<tfoot>';
        sectionTagEnd = '</tfoot>';
        rowsFound = this.footersRowsFound;
        break;
      default:
        return '';
    }
    if (!data) return '';
    let template = sectionTagStart;
    const isHeading = section === 'headings';
    if (rowsFound) {
      for (let i = 0; i < data.length; i++) {
        const row = data[i].row;
        const classes = data[i].classes;
        const id = data[i].id;
        template += `<tr
          ${classes ? ` class="${classes.join(' ')}"` : ''}
          ${id ? ` id="${id}"` : ''}
        >`;
        template += this._getCells(row, isHeading);
        template += '</tr>';
      }
    } else {
      template += '<tr>';
      template += this._getCells(data, isHeading);
      template += '</tr>';
    }
    template += sectionTagEnd;
    return template;
  };

  _getCells = (data, isTh) => {
    let cells = '';
    for (let i = 0; i < this.columnCount; i++) {
      const classes = data[i]?.classes;
      const id = data[i]?.id;
      const colSpan = data[i]?.colSpan;
      const rowSpan = data[i]?.rowSpan;
      const headers = data[i]?.headers;
      const startTag = `<${isTh || data[i]?.isTh ? 'th' : 'td'}
        ${classes ? ` class="${classes.join(' ')}"` : ''}
        ${id ? ` id="${id}"` : ''}
        ${colSpan ? ` colspan="${colSpan}"` : ''}
        ${rowSpan ? ` rowspan="${rowSpan}"` : ''}
        ${headers ? ` headers="${headers}"` : ''}
      >`;
      const closeTag = isTh || data[i]?.isTh ? '</th>' : '</td>';
      cells += startTag + (data[i]?.cell || '') + closeTag;
    }
    return cells;
  };

  _getMaxColumn = () => {
    const headings = this.headings || [];
    const rows = this.rows || [];
    const footers = this.footers || [];
    let maxCount = 0;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].row) {
        this.headingsRowsFound = true;
        if (headings[i].row.length > maxCount) maxCount = headings[i].row.length;
        continue;
      }
    }
    if (!this.headingsRowsFound) {
      if (headings.length > maxCount) maxCount = headings.length;
    }

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].row) {
        this.rowsRowsFound = true;
        if (rows[i].row.length > maxCount) maxCount = rows[i].row.length;
        continue;
      }
    }
    if (!this.rowsRowsFound) {
      if (rows.length > maxCount) maxCount = rows.length;
    }

    for (let i = 0; i < footers.length; i++) {
      if (footers[i].row) {
        this.footersRowsFound = true;
        if (footers[i].row.length > maxCount) maxCount = footers[i].row.length;
        continue;
      }
    }
    if (!this.footersRowsFound) {
      if (footers.length > maxCount) maxCount = footers.length;
    }
    return maxCount;
  };
}

export default Table;
