\language "nederlands"

kunkunshi-signs =
#'(("合" "x" "乙" "x" "老" "下老")
   ("四" "x" "上" "x" "中" "尺" "尺" "下尺")
   ("工" "x" "五" "x" "六" "七" "七" "八" "x" "九"))

#(define (custom-tab-format tab-signs)
  (lambda (context string-number fret-number)
    (let* ((string-signs (list-ref tab-signs (- 3 string-number)))
           (ls-length (length string-signs))
           (my-sign
             (if (> fret-number (1- ls-length))
                 "?"
                 (list-ref string-signs fret-number))))
     (if (integer? fret-number)
         (make-vcenter-markup
           (format #f "~a" my-sign ))
         (fret-number-tablature-format context string-number fret-number)))))

kunkunshiNotation = {
  % Restore behaviour that is turned off by default in tablature
  \revert TabStaff.NoteColumn.ignore-collision

  % Turn off the TAB clef
  \override TabStaff.Clef.stencil = ##f

  % Use kunkunshi position numbering
  \set TabStaff.tablatureFormat = #(custom-tab-format kunkunshi-signs)
}

sanshin-honchoushi-tuning = \stringTuning <c' f' c''>
sanshin-niage-tuning      = \stringTuning <c' g' c''>
sanshin-sansage-tuning    = \stringTuning <c' f' bes'>
