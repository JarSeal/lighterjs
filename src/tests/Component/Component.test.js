import { Component, isComponentLoggerQuiet } from '../../LIGHTER';
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

  it('should fail component creation when trying to use the same id twice', () => {
    new Component({ id: 'myid' });

    let error = '';
    try {
      new Component({ id: 'myid' });
    } catch (err) {
      error = err.message;
    }
    expect(error).toEqual('Duplicate component id.');
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
    appRoot.discard(true);
    expect(document.getElementById('root').children.length).toEqual(0);
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
    expect(typeof comp.draw).toBe('function');
    expect(typeof comp.add).toBe('function');
    expect(typeof comp.addListener).toBe('function');
    expect(typeof comp.removeListener).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.discard).toBe('function');
    expect(typeof comp.getComponentById).toBe('function');
    expect(typeof comp.getComponentElemById).toBe('function');
    expect(typeof comp._setElemData).toBe('function');
    expect(typeof comp._createDefaultTemplate).toBe('function');
    expect(typeof comp._checkParentAndAttachId).toBe('function');
    expect(comp.isComponent).toBeTruthy();
    expect(comp.children).toEqual({});
    expect(comp.listeners).toEqual({});
    expect(comp.listenersToAdd).toEqual([]);
    expect(comp.drawing).toBeFalsy();
    expect(comp.discarding).toBeFalsy();
    expect(comp.router).toEqual(null);
    expect(isUUID(comp.id)).toBeTruthy();
    expect(isUUID(comp.props.id)).toBeTruthy();
    expect(comp.props.text).toEqual(testText);
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
    expect(document.getElementById('root').children.length).toEqual(0);
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
    expect(document.getElementById('root').children.length).toEqual(0);
  });

  // Test discard and full discard
  it('should discard and full discard created components (and its possible children)', () => {});

  // Test getComponentById
  it('should get component class by its ID', () => {});

  // Test getComponentElemById
  it('should get component element but its ID', () => {});
});
