import { Component } from '../../../Lighter';

// Common props:
// - rows: array of objects (<tbody>)
// - headings?: array of objects (<thead>)
// - footers?: array of objects (<tfoot>)
// - columnWidths: array of strings (eg. '20%', '50px', '5rem')
// - isDivsTable?: boolean (whether the table is a table or divs element, default false)
// - basicStyles?: boolean (whether the table has basic CSS applied to it or not, default false)
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
    this.rows = props.rows || null;
    this.headings = props.headings || null;
    this.footers = props.footers || null;
    this.columnWidths = props.columnWidths || null;
    this.isDivsTable = props.isDivsTable || false;
    this.basicStyles = props.basicStyles || false;
    this.headingsRowsFound = false;
    this.rowsRowsFound = false;
    this.footersRowsFound = false;
    this.columnCount = this._getMaxColumn();
    this.props.template = `<div class="tableOuter${this.isDivsTable ? ' isDivsTable' : ''}">
      <${this.isDivsTable ? 'div class="table"' : 'table class="table"'}>
        ${this._createSection('headings')}
        ${this._createSection('rows')}
        ${this._createSection('footers')}
      </${this.isDivsTable ? 'div' : 'table'}>
    </div>`;
  }

  paint = () => {
    this._createInlineStyles();
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
    let skipNextCells = 0; // For colSpan
    for (let i = 0; i < this.columnCount; i++) {
      if (skipNextCells) {
        skipNextCells--;
        continue; // Do not render the next cell because there is a colSpan
      }
      let classes = data[i]?.classes;
      const id = data[i]?.id;
      const dataColSpan = data[i]?.colSpan || 0;
      const colSpan = dataColSpan + i > this.columnCount ? this.columnCount - i : dataColSpan;
      const rowSpan = data[i]?.rowSpan;
      const headers = data[i]?.headers;
      const width = this.columnWidths ? this.columnWidths[i] : null;
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
        ${width ? ` style="width: ${width};"` : ''}
      >`;
      let closeTag = isTh || data[i]?.isTh ? '</th>' : '</td>';
      if (this.isDivsTable) closeTag = '</div>';
      cells += startTag + (data[i]?.cell || '') + closeTag;
      if (colSpan) {
        skipNextCells = colSpan - 1; // Minus 1 because the current cell counts as 1 for the colSpan
      }
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

  _createInlineStyles = () => {
    if (!this.basicStyles) return;
    this.elem.style.boxSizing = 'border-box';
    const border = '1px solid #ccc';
    const backgroundColor = '#fff';
    const cellPadding = '6px 8px 4px';
    if (this.isDivsTable) {
      const cellWidth = 1;
      const flexBasis = (1 / this.columnCount) * 100;
      const tableElem = this.elem.querySelector('.table');
      tableElem.style.borderLeft = border;
      tableElem.style.borderTop = border;
      tableElem.style.backgroundColor = backgroundColor;
      tableElem.style.width = 'auto';
      tableElem.style.display = 'inline-flex';
      tableElem.style.flexDirection = 'column';
      const tableSectionElems = this.elem.querySelectorAll('.table > div');
      for (let i = 0; i < tableSectionElems.length; i++) {
        tableSectionElems[i].style.display = 'flex';
        tableSectionElems[i].style.flexDirection = 'column';
        tableSectionElems[i].style.width = '100%';
      }
      const tableRowElems = this.elem.querySelectorAll('.table .row');
      for (let i = 0; i < tableRowElems.length; i++) {
        tableRowElems[i].style.display = 'flex';
        tableRowElems[i].style.width = '100%';
      }
      const tableCellElems = this.elem.querySelectorAll('.table .cell');
      for (let i = 0; i < tableCellElems.length; i++) {
        const colSpan = tableCellElems[i].getAttribute('colspan');
        const colIndex = i % 5;
        if (colSpan) {
          const width = this.columnWidths ? this.columnWidths[colIndex] : flexBasis * colSpan + '%';
          tableCellElems[i].style.flexGrow = colSpan;
          tableCellElems[i].style.flexBasis = width;
        } else {
          const width = this.columnWidths ? this.columnWidths[colIndex] : flexBasis + '%';
          tableCellElems[i].style.flexGrow = cellWidth;
          tableCellElems[i].style.flexBasis = width;
        }
        tableCellElems[i].style.padding = cellPadding;
        tableCellElems[i].style.borderRight = border;
        tableCellElems[i].style.borderBottom = border;
      }
      const tableThElems = this.elem.querySelectorAll('.table .th');
      for (let i = 0; i < tableThElems.length; i++) {
        tableThElems[i].style.fontWeight = 700;
      }
    } else {
      const tableElem = this.elem.querySelector('.table');
      tableElem.style.textAlign = 'left';
      tableElem.style.border = border;
      tableElem.style.padding = '0';
      tableElem.style.backgroundColor = backgroundColor;
      tableElem.style.borderSpacing = '0';
      tableElem.style.borderCollapse = 'collapse';
      const tableTdElems = this.elem.querySelectorAll('.table td');
      const tableThElems = this.elem.querySelectorAll('.table th');
      const tableCellElems = [...tableTdElems, ...tableThElems];
      for (let i = 0; i < tableCellElems.length; i++) {
        tableCellElems[i].style.padding = cellPadding;
        tableCellElems[i].style.border = border;
      }
      for (let i = 0; i < tableThElems.length; i++) {
        tableThElems[i].style.fontWeight = 700;
      }
    }
  };
}

export default Table;
