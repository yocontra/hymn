'use strict';

var React = require('react');
var merge = require('lodash.merge');
//require('react-raf-batching').inject();

var ProgressBar = React.createClass({
  displayName: 'ProgressBar',
  propTypes: {
    total: React.PropTypes.number,
    value: React.PropTypes.number,
    onSeek: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function(){
    return {
      total: 0,
      value: 0,
      style: {}
    };
  },

  getInitialState: function(){
    return {
      percent: 0
    };
  },

  seek: function(e){
    if (!this.props.onSeek) {
      return;
    }
    var origX = e.pageX || e.touches[0].pageX;
    var target = this.refs.container.getDOMNode();
    var x = origX - target.getBoundingClientRect().left;
    var scale = target.offsetWidth;
    var time = this.props.total*(x/scale);
    this.props.onSeek(time);
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      percent: (props.value / props.total) * 100
    });
  },

  render: function(){
    var style = merge(this.props.style, {
      overflow: 'hidden'
    });
    var translate = 'translateX(' + this.state.percent.toFixed(4) + '%)';
    var slider = React.DOM.div({
      ref: 'slider',
      className: 'progress-value',
      style: {
        position: 'relative',
        left: '-100%',
        height: '100%',
        width: '100%',
        transform: translate,
        webkitTransform: translate,
        msTransform: translate,
        mozTransform: translate
      }
    });

    var container = React.DOM.div({
      ref: 'container',
      className: this.props.className,
      style: style,
      onClick: this.seek,
      onTouchEnd: this.seek,
      onTouchStart: this.seek,
      onTouchMove: this.seek
    }, slider);
    return container;
  }
});

module.exports = ProgressBar;