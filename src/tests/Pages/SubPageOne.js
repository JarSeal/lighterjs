import Component from '../../Lighter/Component';

class SubPageOne extends Component {
  constructor(props) {
    super(props);
  }

  paint = () => {
    this.add({
      _id: 'sub-page-one',
      text: 'Route param: ' + this.router.curRouteData.params.someId,
    }).draw();
  };
}

export default SubPageOne;
