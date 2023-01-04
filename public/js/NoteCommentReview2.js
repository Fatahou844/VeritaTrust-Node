/**
 * // types Type 2
//  * @typedef {{title:string; color:string }} TNoteAndColor
//  * @type {{ [key:number]: TNoteAndColor}
*
 * @typedef {{title:string; className:string }} TNoteAndColor
 * @type {{ [key:number]: TNoteAndColor}
 * */

const noteByTextSize = {
  // Type 1
 //  40: 'Bad',
 //  60: 'Not bad',
  // 80: 'Good',
 //  100: 'Very good',

  // 200: 'Excellent',
  // Type 2
  // 40: { title: 'Bad', color: 'text-danger' },
  // 60: { title: 'Not Bad', color: 'text-warning' },
  // 80: { title: 'Good', color: 'text-info' },
  // 100: { title: 'Very Good', color: 'text-primary' },
  // 200: { title: 'Excellent', color: 'text-success' },

  // Type 3
  80: { title: 'Bad', className: 'bad' },
  160: { title: 'Not Bad', className: 'not_bad' },
  240: { title: 'Good', className: 'good' },
  320: { title: 'Very Good', className: 'very_good' },
  400: { title: 'Excellent', className: 'excellent' },
};

const textSizeByNote = {
  BAD: 80,
  NOT_BAD: 160,
  GOOD: 240,
  VERY_GOOD: 320,
  EXCELLENT: 400,
};

export class CommentReviewNote {
  /**
   * @summary Track and give a note to the comment of reviewer while typing the comment
   *
   *@param {object} props
   *@param {string} props.textAreaId The id of the textarea element (without a #)
   *@param {string} props.noteReviewId The id of the noteReview element (without a #)
   */
  constructor({ textAreaId, noteReviewId }) {
    const errorList = [];

    this.textArea = document.getElementById(textAreaId);
    if (!this.textArea) {
      console.log(this.textArea);
      errorList.push(
        `The textarea element with id ${textAreaId} does not exist`,
      );
    }
    this.noteReview = document.getElementById(noteReviewId);
    if (!this.noteReview) {
      console.log(this.noteReview);
      errorList.push(
        `The noteReview element with id ${noteReviewId} does not exist`,
      );
    }

    if (errorList.length > 0) {
      throw new Error(
        `The following errors have been found: ${errorList.join(', ')}`,
        'Empty selector',
      );
    }

    this.setCommentNoteByCommentSize =
      this.setCommentNoteByCommentSize.bind(this);
    this.previousClassName = noteByTextSize[textSizeByNote.BAD].className;
    this.noteReview.classList.add(this.previousClassName);
  }

  startTracking() {
    this.textArea.addEventListener('input', this.setCommentNoteByCommentSize);
    this.setCommentNoteByCommentSize({ target: this.textArea });
  }

  stopTracking() {
    this.textArea.removeEventListener(
      'input',
      this.setCommentNoteByCommentSize,
    );
  }

  /**
   * @param {Event} e
   */
  setCommentNoteByCommentSize(e) {
    /** @type {string} */
    const text = e.target.value.trim();
    const textLength = text.length;
    // get the note corresponding to the number of characters
    let note = this.getNoteByTextSize(textLength);
    // display the note in the noteReview element
    this.noteReview.innerText = note.title;

    // if it's the same note don't modify the note on the view
    if (this.previousClassName === note.className) return;

    this.noteReview.classList.remove(this.previousClassName); // remove the previous class
    this.noteReview.classList.add(note.className); // add the new class
    this.previousClassName = note.className; // save the new class
  }

  /**
   * @summary get the note corresponding to the number of characters
   *  - if the number of characters is less than 40, the note is BAD
   * - if the number of characters is between 40 and 60, the note is NOT_BAD
   * - if the number of characters is between 60 and 80, the note is GOOD
   * - if the number of characters is between 80 and 100, the note is VERY_GOOD
   * - if the number of characters is greater than 100, the note is EXCELLENT
   *
   * @param {number} textSize
   * @returns {TNoteAndColor} The note corresponding to the number of characters
   */
  getNoteByTextSize(textSize) {
    if (textSize < textSizeByNote.BAD) {
      return noteByTextSize[textSizeByNote.BAD];
    } else if (
      textSize >= textSizeByNote.BAD &&
      textSize < textSizeByNote.NOT_BAD
    ) {
      return noteByTextSize[textSizeByNote.NOT_BAD];
    } else if (
      textSize >= textSizeByNote.NOT_BAD &&
      textSize < textSizeByNote.GOOD
    ) {
      return noteByTextSize[textSizeByNote.GOOD];
    } else if (
      textSize >= textSizeByNote.GOOD &&
      textSize < textSizeByNote.VERY_GOOD
    ) {
      return noteByTextSize[textSizeByNote.VERY_GOOD];
    } else if (
      textSize >= textSizeByNote.VERY_GOOD &&
      textSize < textSizeByNote.EXCELLENT
    ) {
      return noteByTextSize[textSizeByNote.EXCELLENT];
    }
    return noteByTextSize[textSizeByNote.EXCELLENT];
  }
}
let container = document.querySelector("#productreviews");
let product_review_bloc = container.querySelectorAll("div.form__header");

const productReviewArray = Array.from(product_review_bloc);

var i = 0;

productReviewArray.forEach(div => {
    
    var reviewCom = new CommentReviewNote({
      textAreaId: 'content'+i.toString(),
      noteReviewId: 'note-review'+i.toString(),
    });
    
    reviewCom.startTracking();
    //reviewCom.stopTracking();
    i = i + 1;
    
});
