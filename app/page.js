"use client";

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      var drawing = false;
      var prevX, prevY;
      var currX, currY;
      var signature = document.getElementsByName('signature')[0];

      // Duplicate addEventListener lines for both mouse and touch events
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stop);
      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("touchmove", draw);
      canvas.addEventListener("touchend", stop);
      canvas.addEventListener("touchstart", start);

      function start(e) {
        drawing = true;
      }

      function stop() {
        drawing = false;
        prevX = prevY = null;
        signature.value = canvas.toDataURL();
      }

      function draw(e) {
        if (!drawing) {
          return;
        }
        var clientX, clientY;

        // Determine clientX and clientY based on event type
        if (e.type.includes('touch')) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }

        currX = clientX - canvas.offsetLeft;
        currY = clientY - canvas.offsetTop;
        if (!prevX && !prevY) {
          prevX = currX;
          prevY = currY;
        }

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        prevX = currX;
        prevY = currY;
      }

      function onSubmit(e) {
        console.log({
          'name': document.getElementsByName('name')[0].value,
          'signature': signature.value,
        });
        return false;
      }
    }
  }, []);

  return (
      <>
        <div>
          <input name="name" placeholder="Your name" required />
        </div>
        <div>
          <canvas ref={canvasRef} id="signature" width="300" height="100"></canvas>
        </div>
        <div>
          <input type="hidden" name="signature" />
        </div>
        <button type="submit">Send</button>
      </>
  );
}
