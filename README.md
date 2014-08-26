# hymn [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support us][gittip-image]][gittip-url]


## Information

<table>
<tr>
<td>Package</td><td>hymn</td>
</tr>
<tr>
<td>Description</td>
<td>React audio player component</td>
</tr>
<tr>
<td>Browser Version</td>
<td>>= IE9</td>
</tr>
</table>

### Usage

```js
var player = require('hymn');

var A = React.createClass({
  render: function(){
    return (
      <div>
        <h3>Cool Song</h3>
        <player src='file.mp3' title='Cool Song' album='Cool Songs' artist='Mr Cool Song' artwork='coolsong.jpg'/>
      </div>
    );
  }
});
```

## Browser Support

### Out of the box

<table>
<tr>
<td>Chrome</td>
<td>3</td>
</tr>
<tr>
<td>Firefox (Gecko)</td>
<td>3.5</td>
</tr>
<tr>
<td>Internet Explorer</td>
<td>9</td>
</tr>
<tr>
<td>Opera</td>
<td>10.5</td>
</tr>
<tr>
<td>Safari</td>
<td>3.1</td>
</tr>
</table>

[gittip-url]: https://www.gittip.com/WeAreFractal/
[gittip-image]: http://img.shields.io/gittip/WeAreFractal.svg

[downloads-image]: http://img.shields.io/npm/dm/hymn.svg
[npm-url]: https://npmjs.org/package/hymn
[npm-image]: http://img.shields.io/npm/v/hymn.svg