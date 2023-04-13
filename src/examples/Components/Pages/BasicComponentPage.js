import { marked } from 'marked';
import Component from '../../../Lighter/Component';
import { componentsList } from '../BasicComponents';
import Button from '../BasicComponents/Button';

class BasicComponentPage extends Component {
  constructor(props) {
    super(props);
    this.componentId = props.routeParams.componentId;
    this.componentInfo = componentsList.find((c) => c.id === this.componentId);
    this.props.template = `<div class="basicComponent">
      <h1>${this.componentInfo.name}</h1>
      <hr />
      <h3>Examples:</h3>
      <div id="examples"></div>
      <hr />
      <h3>Code:</h3>
      <div id="code">${this.showCode(this.componentInfo.code)}</div>
      <div id="copyCode"></div>
      <hr />
    </div>`;
  }

  showCode = (rawStr) => {
    if (!rawStr) return '';
    return marked.parse('```javascript ' + ('\n' + rawStr) + ' ```');
  };

  paint = () => {
    this.add(
      new Button({
        text: '<- back',
        prepend: true,
        onClick: () => this.router.changeRoute('/basic-components'),
      })
    ).draw();
    this.componentInfo.examples(this, this.componentInfo.component);
    if (this.componentInfo.code) {
      const copyCodeButton = this.add(
        new Button({
          text: 'Copy code',
          attachId: 'copyCode',
          onClick: () => {
            navigator.clipboard.writeText(this.componentInfo.code).then(() => {
              copyCodeButton.draw({ text: 'COPIED!' });
              setTimeout(() => {
                copyCodeButton.draw({ text: 'Copy code' });
              }, 2500);
            });
          },
        })
      ).draw();
    }
  };
}

export default BasicComponentPage;
