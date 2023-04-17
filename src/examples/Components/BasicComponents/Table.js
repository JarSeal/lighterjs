import { Component } from '../../../Lighter';

// Common props:
// - isDivsTable: boolean (whether the table is a table or divs element, default false)
// - rows: array of objects (<tbody>)
// - headings?: array of objects (<thead>)
// - footers?: array of objects (<tfoot>)
// For headings, rows, and footers, the data can be in two different formats (headings has always th cell tags):
// A (simple one row): [
//   { cell: string/template, classes?: string[], colSpan?: number, rowSpan?: number, id?: string, isTh?: boolean }
// ]
// B (for multiple rows and row properties): [
//   { classes?: string[], id?: string, row: [
//      { cell: string/template, classes?: string[], colSpan?: number, rowSpan?: number, id?: string, isTh?: boolean }
//   ]}
// ]
class Table extends Component {
  constructor(props) {
    super(props);
    this.isDivsTable = props.isDivsTable || false;
    this.rows = props.rows || null;
    this.headings = props.headings || null;
    this.footers = props.footers || null;
    this.headingsRowsFound = false;
    this.rowsRowsFound = false;
    this.footersRowsFound = false;
    this.columnCount = this._getMaxColumn();
    this.props.template = `<div class="tableOuter${this.isDivsTable ? ' isDivsTable' : ''}">
      <${this.isDivsTable ? 'div class="table"' : 'table'}
        ${props.alignTextLeft ? ' style="text-align: left;"' : ''}
      >
        ${this._createSection('headings')}
        ${this._createSection('rows')}
        ${this._createSection('footers')}
      </${this.isDivsTable ? 'div' : 'table'}>
    </div>`;
  }

  paint = () => {
    if (this.isDivsTable) {
      const gap = '5px';
      const cellWidth = 100 / this.columnCount + '%';
      const tableElem = this.elem.querySelector('.table');
      tableElem.style.width = 'auto';
      tableElem.style.display = 'inline-flex';
      tableElem.style.flexDirection = 'column';
      tableElem.style.gap = gap;
      const tableSectionElems = this.elem.querySelectorAll('.table > div');
      for (let i = 0; i < tableSectionElems.length; i++) {
        tableSectionElems[i].style.display = 'flex';
        tableSectionElems[i].style.flexDirection = 'column';
        tableSectionElems[i].style.gap = gap;
        tableSectionElems[i].style.width = '100%';
      }
      const tableRowElems = this.elem.querySelectorAll('.table .row');
      for (let i = 0; i < tableRowElems.length; i++) {
        tableRowElems[i].style.display = 'flex';
        tableRowElems[i].style.gap = gap;
        tableRowElems[i].style.width = '100%';
      }
      const tableCellElems = this.elem.querySelectorAll('.table .cell');
      for (let i = 0; i < tableCellElems.length; i++) {
        tableCellElems[i].style.width = cellWidth;
      }
    }
  };

  _createSection = (section) => {
    let data = null,
      sectionTagStart = '',
      sectionTagEnd = '',
      rowsFound = false;
    switch (section) {
      case 'headings':
        data = this.headings;
        sectionTagStart = this.isDivsTable ? '<div class="thead">' : '<thead>';
        sectionTagEnd = this.isDivsTable ? '</div>' : '</thead>';
        rowsFound = this.headingsRowsFound;
        break;
      case 'rows':
        data = this.rows;
        sectionTagStart = this.isDivsTable ? '<div class="tbody">' : '<tbody>';
        sectionTagEnd = this.isDivsTable ? '</div>' : '</tbody>';
        rowsFound = this.rowsRowsFound;
        break;
      case 'footers':
        data = this.footers;
        sectionTagStart = this.isDivsTable ? '<div class="tfoot">' : '<tfoot>';
        sectionTagEnd = this.isDivsTable ? '</div>' : '</tfoot>';
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
        const classes = data[i].classes || (this.isDivsTable ? [] : undefined);
        this.isDivsTable ? (classes.push('tr'), classes.push('row')) : null;
        const id = data[i].id;
        template += `<${this.isDivsTable ? 'div' : 'tr'}
          ${classes ? ` class="${classes.join(' ')}"` : ''}
          ${id ? ` id="${id}"` : ''}
        >`;
        template += this._getCells(row, isHeading);
        template += this.isDivsTable ? '</div>' : '</tr>';
      }
    } else {
      template += this.isDivsTable ? '<div class="tr row">' : '<tr>';
      template += this._getCells(data, isHeading);
      template += this.isDivsTable ? '</div>' : '</tr>';
    }
    template += sectionTagEnd;
    return template;
  };

  _getCells = (data, isTh) => {
    let cells = '';
    for (let i = 0; i < this.columnCount; i++) {
      let classes = data[i]?.classes;
      const id = data[i]?.id;
      const colSpan = data[i]?.colSpan;
      const rowSpan = data[i]?.rowSpan;
      const headers = data[i]?.headers;
      let tag = isTh || data[i]?.isTh ? 'th' : 'td';
      if (this.isDivsTable) {
        tag = 'div';
        if (classes) {
          classes.push('cell');
          classes.push(isTh || data[i]?.isTh ? 'th' : 'td');
        } else {
          classes = ['cell', isTh || data[i]?.isTh ? 'th' : 'td'];
        }
      }
      const startTag = `<${tag}
        ${classes ? ` class="${classes.join(' ')}"` : ''}
        ${id ? ` id="${id}"` : ''}
        ${colSpan ? ` colspan="${colSpan}"` : ''}
        ${rowSpan ? ` rowspan="${rowSpan}"` : ''}
        ${headers ? ` headers="${headers}"` : ''}
      >`;
      let closeTag = isTh || data[i]?.isTh ? '</th>' : '</td>';
      if (this.isDivsTable) closeTag = '</div>';
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
