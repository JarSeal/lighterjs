import Component from '../../../Lighter/Component';
import { componentsList } from '../BasicComponents';

class BasicComponentsPage extends Component {
  constructor(props) {
    super(props);
    this.props.template = `<div>
      <h1>Basic Components</h1>
    </div>`;
  }

  addListeners = () => {
    this.addListener({
      id: 'list-link-click',
      target: this.elem.querySelector('ul'),
      type: 'click',
      fn: (e) => {
        e.preventDefault();
        if (e.target.nodeName !== 'A') return;
        this.router.changeRoute(e.target.pathname);
      },
    });
  };

  paint = () => {
    const compoList = this.add({ tag: 'ul' }).draw();
    componentsList.forEach((c) => this._createListLink(compoList, c));
  };

  _createListLink = (parent, c) => {
    const template = `<li><a href="/basic-components/${c.id}">${c.name}</a></li>`;
    parent.add({ template }).draw();
  };
}

export default BasicComponentsPage;
