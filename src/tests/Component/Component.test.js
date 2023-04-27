import {
  Component,
  isComponentLoggerQuiet,
  getComponentById,
  getComponentElemById,
} from '../../Lighter';
import { createEmptyRootDiv, isUUID } from '../testUtils';

describe('Component class tests', () => {
  beforeAll(() => {
    isComponentLoggerQuiet(true);
    createEmptyRootDiv();
  });

  it('should fail component creation when trying to use invalid props', () => {
    let error = '';
    try {
      new Component({ children: [] });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Invalid Component props key.');

    error = '';
    try {
      new Component({ parent: {} });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Invalid Component props key.');
  });

  it('should not draw when drawing and discarding are in progress', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.drawing = true;
    appRoot.draw({ text: 'test 2' });
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.drawing = false;
    appRoot.discarding = true;
    appRoot.draw({ text: 'test 3' });
    expect(document.getElementById('appRoot').textContent).toEqual('test');

    appRoot.discarding = false;
    appRoot.draw({ text: 'testing' });
    expect(document.getElementById('appRoot').textContent).toEqual('testing');

    appRoot.discard(true);
  });

  it('should fail when trying to draw a component without a parent or attachId', () => {
    const comp = new Component();
    let error = '';
    try {
      comp.draw();
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');
  });

  it('should create a basic text div and check the component class types and default values', () => {
    const testText = 'Test text';
    const comp = new Component({ text: testText });
    expect(typeof comp.add).toBe('function');
    expect(typeof comp.addDraw).toBe('function');
    expect(typeof comp.addListener).toBe('function');
    expect(typeof comp.addListeners).toBe('function');
    expect(comp.children).toEqual({});
    expect(typeof comp.discard).toBe('function');
    expect(comp.discarding).toBeFalsy();
    expect(typeof comp.draw).toBe('function');
    expect(comp.drawing).toBeFalsy();
    expect(comp.elem).toEqual(undefined);
    expect(typeof comp.getComponentById).toBe('function');
    expect(typeof comp.getComponentElemById).toBe('function');
    expect(isUUID(comp.id)).toBeTruthy();
    expect(isUUID(comp.props.id)).toBeTruthy();
    expect(typeof comp.ignorePropChanges).toBe('function');
    expect(comp.ignorePropChanges()).toEqual([]);
    expect(comp.isComponent).toBeTruthy();
    expect(comp.isDrawn).toBeFalsy();
    expect(comp.listeners).toEqual({});
    expect(comp.listenersToAdd).toEqual([]);
    expect(typeof comp.paint).toBe('function');
    expect(comp.parent).toEqual(undefined);
    expect(comp.props).toEqual({ id: comp.id, text: testText });
    expect(typeof comp.removeListener).toBe('function');
    expect(comp.router).toEqual(null);
    expect(comp.template).toEqual('<div></div>');
    expect(typeof comp._checkParentAndAttachId).toBe('function');
    expect(typeof comp._createDefaultTemplate).toBe('function');
    expect(typeof comp._createElement).toBe('function');
    expect(typeof comp._parseIgnoredProps).toBe('function');
    expect(typeof comp._setElemData).toBe('function');
  });

  it('should fail when registering a listener without type or fn', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const button = appRoot.add({ tag: 'button', text: 'Click me' });

    let error = '';
    try {
      button.addListener({ type: 'click' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');

    error = '';
    try {
      button.addListener({ fn: 'click' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Call stack');

    appRoot.discard(true);
  });

  it('should fail when trying to remove an unknown listener', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const button = appRoot.add({ tag: 'button', text: 'Click me', preCreateElement: true });
    button.addListener({ type: 'click', fn: () => {} });
    let error = '';
    try {
      button.removeListener('unknownId');
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual("Cannot read properties of undefined (reading 'target')");

    appRoot.discard(true);
  });

  // Test discard and full discard
  it('should discard and full discard created components (and its possible children)', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const div = appRoot.add({ _id: 'my-div' }).draw();
    const discardDiv = div.add({ _id: 'discard-div' }).draw();

    expect(Boolean(document.getElementById('appRoot'))).toBeTruthy();
    expect(Boolean(document.getElementById('my-div'))).toBeTruthy();
    expect(Boolean(document.getElementById('discard-div'))).toBeTruthy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();

    // Soft and hard discard for a single component
    discardDiv.discard();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();
    discardDiv.draw();
    discardDiv.discard(true);
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('discard-div')?.isComponent).toBeFalsy();

    // Since the discardDiv is still in this components memory,
    // it can be redrawn (garbage collector finishes the job afterwards).
    // Drawing it again, will add it to the component's list.
    discardDiv.draw();

    // Soft discard of a component with children
    div.discard();

    expect(Boolean(document.getElementById('my-div'))).toBeFalsy();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('my-div').isComponent).toBeTruthy();
    expect(getComponentById('discard-div').isComponent).toBeTruthy();

    div.draw();
    discardDiv.draw();
    expect(Boolean(document.getElementById('discard-div'))).toBeTruthy();

    // Hard discard of a component with children
    div.discard(true);

    expect(Boolean(document.getElementById('my-div'))).toBeFalsy();
    expect(Boolean(document.getElementById('discard-div'))).toBeFalsy();
    expect(getComponentById('my-div')).toBeFalsy();
    expect(getComponentById('discard-div')).toBeFalsy();

    appRoot.discard(true);
    expect(document.getElementById('root').children.length).toEqual(0);
  });

  // Test getComponentById
  it('should get component class by its ID', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const appRootComponent = getComponentById('appRoot');

    expect(getComponentById('appRoot')).toEqual(appRootComponent);
    expect(getComponentById('someNoneExistingId')).toEqual(undefined);

    appRoot.discard(true);
  });

  // Test getComponentElemById
  it('should get component element by its ID', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const appRootElem = getComponentElemById('appRoot');

    expect(appRootElem).toEqual(appRoot.elem);

    appRoot.discard(true);
  });

  // Test addDraw
  it('should add and draw with one addDraw call', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const div = appRoot.addDraw({ _id: 'my-div', text: 'My text' });
    const divElem = document.getElementById('my-div');

    expect(div.id).toEqual('my-div');
    expect(div.props.text).toEqual('My text');
    expect(divElem.textContent).toEqual('My text');

    appRoot.discard(true);
  });

  // Test "redraw"
  it('should "redraw" itself in the DOM and keep its position as a child', () => {
    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const components = [];

    for (let i = 0; i < 10; i++) {
      components.push(appRoot.addDraw({ _id: 'div-' + i, text: 'DIV ' + i }));
    }

    for (let i = 0; i < 10; i++) {
      const divElem = document.getElementById('div-' + i);
      expect(components[i].id).toEqual('div-' + i);
      expect(divElem.textContent).toEqual('DIV ' + i);
    }

    components[3].draw({ template: '<button>My button</button>' });
    components[6].draw({ text: 'Changed text' });
    components[9].draw({ tag: 'h3' });

    const elem3 = document.getElementById('div-3');
    const elem6 = document.getElementById('div-6');
    const elem9 = document.getElementById('div-9');

    expect(elem3.nodeName).toEqual('BUTTON');
    expect(elem3.textContent).toEqual('My button');
    expect(elem6.nodeName).toEqual('DIV');
    expect(elem6.textContent).toEqual('Changed text');
    expect(elem9.nodeName).toEqual('H3');
    expect(elem9.textContent).toEqual('DIV 9');

    expect(appRoot.elem.children[3]).toEqual(elem3);
    expect(appRoot.children['div-3'].elem).toEqual(elem3);
    expect(appRoot.elem.children[6]).toEqual(elem6);
    expect(appRoot.children['div-6'].elem).toEqual(elem6);
    expect(appRoot.elem.children[9]).toEqual(elem9);
    expect(appRoot.children['div-9'].elem).toEqual(elem9);

    appRoot.discard(true);
  });

  // Test _parseIgnoredProps
  it('should parse out the ignored props', () => {
    const comp = new Component();
    expect(comp._parseIgnoredProps()).toEqual({});
    expect(comp._parseIgnoredProps({})).toEqual({});

    const newProps = { testProp1: true, testProp2: true };
    expect(comp._parseIgnoredProps(newProps)).toEqual(newProps);
    expect(comp._parseIgnoredProps({ ...newProps, id: 'newId' })).toEqual(newProps);
    expect(comp._parseIgnoredProps({ ...newProps, _id: 'newId' })).toEqual(newProps);
    expect(comp._parseIgnoredProps({ ...newProps, prepend: true })).toEqual(newProps);
    expect(
      comp._parseIgnoredProps({ ...newProps, id: 'newId', _id: 'newId', prepend: true })
    ).toEqual(newProps);

    comp.ignorePropChanges = () => ['template', 'someOtherProp'];
    expect(comp._parseIgnoredProps({ ...newProps, template: '<span>New template</span>' })).toEqual(
      newProps
    );
    expect(comp._parseIgnoredProps({ ...newProps, someOtherProp: false })).toEqual(newProps);
    expect(
      comp._parseIgnoredProps({
        ...newProps,
        someOtherProp: false,
        template: '<span>New template</span>',
      })
    ).toEqual(newProps);
    expect(
      comp._parseIgnoredProps({
        ...newProps,
        someOtherProp: false,
        someNotIgnoredProp: true,
        template: '<span>New template</span>',
      })
    ).toEqual({ ...newProps, someNotIgnoredProp: true });

    comp.ignorePropChanges = () => true;
    expect(comp._parseIgnoredProps(newProps)).toEqual({});

    comp.discard(true);
  });

  // Test ignorePropChanges
  it('should parse out the ignored props and not change the template', () => {
    const correctTemplate = '<span>My template</span>';
    const ignoredTemplate = '<button>Changed template</button>';

    const appRoot = new Component({
      _id: 'appRoot',
      attachId: 'root',
      text: 'test',
    });
    appRoot.draw();

    const comp = appRoot.addDraw(new Component({ template: correctTemplate }));

    expect(comp.template).toEqual(correctTemplate);
    comp.draw();
    expect(comp.template).toEqual(correctTemplate);
    comp.draw({ template: ignoredTemplate });
    expect(comp.template).toEqual(ignoredTemplate);
    comp.draw({ template: correctTemplate });
    comp.ignorePropChanges = () => 'template';
    comp.draw({ template: ignoredTemplate });
    expect(comp.template).toEqual(correctTemplate);

    appRoot.discard(true);
  });
});
