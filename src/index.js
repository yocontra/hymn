'use strict';

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var DOM = require('react/lib/ReactDOM');
var PropTypes = require('react/lib/ReactPropTypes');

var Player = ReactCompositeComponent.createClass({
  displayName: 'Player',
  propTypes: {
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    preload: PropTypes.bool,
    onSkip: PropTypes.func,
    onEnd: PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autoPlay: false,
      loop: false,
      muted: false,
      preload: true
    };
  },

  getInitialState: function() {
    return {
      playing: this.props.autoPlay,
      duration: 0,
      position: 0
    };
  },

  // component states
  toggle: function() {
    this.setState({
      playing: !this.state.playing
    }, this.sync);
  },

  // sync all non-props
  // back to the dom element
  sync: function() {
    var audioTag = this.refs.audioTag.getDOMNode();

    if (this.state.playing) {
      audioTag.play();
    } else {
      audioTag.pause();
    }

    if (!isNaN(audioTag.duration)) {
      this.setState({
        duration: audioTag.duration,
        position: audioTag.currentTime
      });
    }
  },

  componentDidMount: function() {
    this.sync();
  },

  render: function(){
    var audioTag = DOM.audio({
      ref: 'audioTag',
      key: 'audioTag',
      controls: false,

      loop: this.props.loop,
      muted: this.props.muted,
      preload: this.props.preload,
      autoPlay: this.props.autoPlay,

      onDurationChange: this.sync,
      onTimeUpdate: this.sync,
      onEnded: this.props.onEnd
    }, this.props.children);

    var playPauseClass = this.state.playing ? 'hymn-pause' : 'hymn-play';
    var playPause = DOM.button({
      ref: 'playPause',
      key: 'playPause',
      className: 'hymn-control ' + playPauseClass,
      onClick: this.toggle
    });

    var skipButton = DOM.button({
      ref: 'skipButton',
      key: 'skipButton',
      className: 'hymn-control hymn-skip',
      onClick: this.props.onSkip
    });

    var progressBar = DOM.progress({
      ref: 'progressBar',
      key: 'progressBar',
      className: 'hymn-progress',
      value: this.state.position,
      max: this.state.duration
    });

    var artwork = DOM.img({
      ref: 'artwork',
      key: 'artwork',
      src: this.props.artwork,
      className: 'hymn-artwork'
    });

    var controlChildren = [playPause, progressBar];
    if (!this.props.onSkip) {
      controlChildren.push(skipButton);
    }
    var controls = DOM.div({
      ref: 'controls',
      key: 'controls',
      className: 'hymn-controls'
    }, controlChildren);

    var container = DOM.div({
      ref: 'container',
      className: 'hymn-player'
    }, [artwork, controls, audioTag]);
    return container;
  }
});

module.exports = Player;