import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { control } from '../redux/modules/midi'

import PIXI from "pixi.js"
import pixel from "../static/pixel.png"

export class Scene extends React.Component<void, Props, void> {

  componentDidMount() {
    this.w = 1024
  	this.h = 768

  	this.n = 2000
  	this.d = 1
  	this.current = 1
  	this.objs = 2
  	this.vx = 0
  	this.vy = 0
  	this.vz = 0
  	this.points1 = []
  	this.points2 = []
  	this.points3 = []
  	this.tpoint1 = []
  	this.tpoint2 = []
  	this.tpoint3 = []
  	this.balls = []
    this.zoom = 1

    this.start()
    window.addEventListener("keydown", (e) => {
      if (this.current < 3)
        this.current++
      else
        this.current = 1
      this.makeObject(this.current)
    }, true);
  }

  start() {
		var ballTexture = new PIXI.Texture.fromImage(pixel)
		this.renderer = PIXI.autoDetectRenderer(this.w, this.h)
		this.stage = new PIXI.Stage
		this.refs.sceneCanvas.appendChild(this.renderer.view)
		this.makeObject(1)

		for (var i = 0; i < this.n; i++)
		{
			this.tpoint1[i] = this.points1[i]
			this.tpoint2[i] = this.points2[i]
			this.tpoint3[i] = this.points3[i]

			var tempBall = new PIXI.Sprite(ballTexture)
			tempBall.anchor.x = 0.5
			tempBall.anchor.y = 0.5
			tempBall.alpha = 0.5
			this.balls[i] = tempBall

			this.stage.addChild(tempBall)
		}
		this.resize()
		requestAnimationFrame(this.update)
	}

  makeObject ( t ) {
    let xd = 0

    switch (t) {
      case 1:
        for (var i = 0; i < this.n; i++)
        {
          xd = -90 + Math.round(Math.random() * 180);
					this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
					this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
					this.points3[i] = Math.sin(i * 360 / this.n) * 100;
        }
        break;
      case 2:
        for (var i = 0; i < this.n; i++)
        {
          xd = -90 + Math.round(Math.random() * 180);
					this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
					this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
					this.points3[i] = Math.sin(i * 360 / this.n) * 100;
        }
        break;
      case 3:
        for (var i =0; i < this.n; i++)
        {
          xd = -90 + Math.round(Math.random() * 180);
					this.points1[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.cos(i * 360 / this.n) * 10);
					this.points2[i] = (Math.sin(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
					this.points3[i] = Math.sin(i * 360 / this.n) * 100;
        }
    }
  }

  resize () {
		this.w = window.innerWidth
		this.h = window.innerHeight

		this.renderer.resize(this.w, this.h)
	}


  constructor( props ) {
    super(props)
    this.update = this.update.bind(this)
  }

  update() {
		var x3d, y3d, z3d, tx, ty, tz, ox

		if (this.d < 250){
      this.d++
		}

		this.vx += 0.0075
		this.vy += 0.0075
		this.vz += 0.0075

		for (var i = 0; i < this.n; i++)
		{
			if (this.points1[i] > this.tpoint1[i]) { this.tpoint1[i] = this.tpoint1[i] + 1 }
			if (this.points1[i] < this.tpoint1[i]) { this.tpoint1[i] = this.tpoint1[i] - 1 }
			if (this.points2[i] > this.tpoint2[i]) { this.tpoint2[i] = this.tpoint2[i] + 1 }
			if (this.points2[i] < this.tpoint2[i]) { this.tpoint2[i] = this.tpoint2[i] - 1 }
			if (this.points3[i] > this.tpoint3[i]) { this.tpoint3[i] = this.tpoint3[i] + 1 }
			if (this.points3[i] < this.tpoint3[i]) { this.tpoint3[i] = this.tpoint3[i] - 1 }

      let zoom = this.props.midiState.get(37) ? this.props.midiState.get(37)/127 : 0
      let skew = this.props.midiState.get(36) ? this.props.midiState.get(36)/127 : 0


			x3d = this.tpoint1[i] * zoom * 2
			y3d = this.tpoint2[i] * zoom * 2
			z3d = this.tpoint3[i] * zoom * 2* skew

			ty = (y3d * Math.cos(this.vx)) - (z3d * Math.sin(this.vx))
			tz = (y3d * Math.sin(this.vx)) + (z3d * Math.cos(this.vx))
			tx = (x3d * Math.cos(this.vy)) - (tz * Math.sin(this.vy))
			tz = (x3d * Math.sin(this.vy)) + (tz * Math.cos(this.vy))
			ox = tx
			tx = (tx * Math.cos(this.vz)) - (ty * Math.sin(this.vz))
			ty = (ox * Math.sin(this.vz)) + (ty * Math.cos(this.vz))

			this.balls[i].position.x = (512 * tx) / (this.d - tz) + this.w / 2
			this.balls[i].position.y = (this.h/2) - (512 * ty) / (this.d - tz)

		}

		this.renderer.render(this.stage)

		requestAnimationFrame(this.update)
	}

  render () {
    return (
      <div className='scene-wrapper' ref='sceneCanvas' >
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  control: state.control
})
export default connect(mapStateToProps, {
  control: control
})(Scene)
