import React from "react";

const FollowerEggIcon = (props) => {
  return (
    <img
      onClick={props.onClick}
      id={props.id}
      data-egg={props.dataEgg}
      className="cursor-pointer"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACC0lEQVQ4jX2Ty2sTURSHf3fmTmbyIJ0k1Vjr2FeqND4aXIloH7Tgi4obd4UUxEXd6caV4D8gdiGKm1JxIRYRoQQRN4LoIlXQFIuVKrRJidJgTdO8mpk5LsQ6zCQ5u3vO7/vuAy5DndK0C3t5ULkhqYq7uppfN7cNU+C1eysrL7P2LLM3osPxQ1JvaLb9+vE+z4EQI7B0ZXljMjU8MwpBv5tOv/hmzQvWRefQhCJFgnP7bw5EGRH7uwNp7oj6NJa68gQkXotEzsoNBf5e9UFgtLur/GUd7oOt1pHiCninZb98v1ril+sLLs2K8m7vWOlrDupIt+NdGNDX//nqUSZQB3BLcAiO9XyaVHqCAV+szQHvhIniJthrTUuedAioULmob1bRMtjRUEBgg+Fz0XeMxBMOgeiV9kA3IfpcDQW1X2XFd6YrCpDiEEDiCg95msHQNyqQg27VNEHOKxhmLRzvbwoDgF4sF62zHYGer+bIINjLCgNUW5t5nwaY8wRM5nNbH7JNYMAo6vOFtz8OQzCSDsHHqe+3c88Ws41gADCq5pQo0EAm4331ryf+Hy/Srs5Ymcl8iLd6XHZYcIkPF04/WhKJlvOF50t1BMDPheS88jvsYW6+z3skHDArOkAoMYHdSY1MJ2FAXV1LPLYyjt8IAFrb+VOu9pZx0c/ZdmYzp28ZAiMzkc4m3tizfwC13s77UeZRnAAAAABJRU5ErkJggg=="
      alt="egg"
    />
  );
};

export default FollowerEggIcon;
