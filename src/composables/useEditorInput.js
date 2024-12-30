import { nextTick } from "vue"

export function useEditorInput() {
  // 커서가 첫 번째 줄에 있는지 확인하는 함수
  const isCaretAtFirstLine = (element) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return Math.abs(rect.top - elementRect.top) < 5
  }

  // 커서가 마지막 줄에 있는지 확인하는 함수
  const isCaretAtLastLine = (element) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    return (
      Math.abs(
        elementRect.top + elementRect.height - (rect.top + rect.height)
      ) < 5
    )
  }

  // Shift + Enter 키 처리 함수
  const handleShiftEnter = (e, index, blocks, updateBlocks) => {
    e.preventDefault()

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const block = e.target

    // 현재 커서 위치에서의 내용 분리
    const currentContent = block.textContent
    const offset = range.startOffset
    const beforeCursor = currentContent.slice(0, offset)
    const afterCursor = currentContent.slice(offset)

    // 줄바꿈 문자 삽입
    const newContent = beforeCursor + "\n" + afterCursor
    block.textContent = newContent

    // 상태 업데이트
    const newBlocks = [...blocks]
    newBlocks[index].content = newContent
    updateBlocks(newBlocks)

    // 커서를 줄바꿈 다음 위치로 이동
    nextTick(() => {
      try {
        const textNode = block.firstChild || block
        const newRange = document.createRange()
        const newOffset = offset + 1

        // 커서를 새로운 줄의 시작 위치로 이동
        newRange.setStart(textNode, newOffset)
        newRange.collapse(true)

        selection.removeAllRanges()
        selection.addRange(newRange)

        // 새로운 줄이 보이도록 스크롤 조정
        const rect = newRange.getBoundingClientRect()
        if (rect) {
          block.scrollTop = block.scrollHeight
        }
      } catch (error) {
        console.error("커서 위치 복원 실패:", error)
      }
    })
  }

  // Enter 키 처리 함수
  const handleEnter = (e, index, blocks, blockRefs, updateBlocks) => {
    e.preventDefault()

    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const currentBlock = e.target
    const offset = range.startOffset

    // 현재 내용을 커서 위치 기준으로 분할
    const currentContent = currentBlock.textContent
    const beforeCursor = currentContent.slice(0, offset)
    const afterCursor = currentContent.slice(offset)

    // 새 블록 ID 생성
    const newId = Math.max(...blocks.map((b) => b.id)) + 1

    // 블록 업데이트
    const newBlocks = [...blocks]
    newBlocks[index].content = beforeCursor // 현재 블록은 커서 이전 내용만 유지
    newBlocks.splice(index + 1, 0, { id: newId, content: afterCursor }) // 커서 이후 내용은 새 블록으로
    updateBlocks(newBlocks)

    // 새 블록으로 포커스 이동
    nextTick(() => {
      const newBlock = blockRefs.value[index + 1]
      if (newBlock) {
        newBlock.focus()

        // 커서를 새 블록의 시작 위치로 이동
        const textNode = newBlock.firstChild || newBlock
        const newRange = document.createRange()
        newRange.setStart(textNode, 0)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    })
  }

  // Delete 키 처리 함수
  const handleDelete = (e, index, blocks, blockRefs, updateBlocks) => {
    if (index < blocks.length - 1) {
      const currentBlock = e.target
      const nextBlock = blockRefs.value[index + 1]
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)

      // 현재 블록이 비어있거나, 커서가 맨 끝에 있는 경우에만 처리
      const isAtEnd = range.startOffset === currentBlock.textContent.length

      if (isAtEnd) {
        e.preventDefault()

        if (!currentBlock.textContent.trim()) {
          // 현재 블록이 비어있는 경우: 현재 블록 삭제
          const newBlocks = [...blocks]
          newBlocks.splice(index, 1)
          updateBlocks(newBlocks)

          nextTick(() => {
            if (nextBlock) {
              nextBlock.focus()
              const newRange = document.createRange()
              const textNode = nextBlock.firstChild || nextBlock
              newRange.setStart(textNode, 0)
              newRange.collapse(true)
              selection.removeAllRanges()
              selection.addRange(newRange)
            }
          })
        } else {
          // 현재 블록에 내용이 있는 경우: 다음 블록 내용을 현재 블록에 병합
          const currentContent = currentBlock.textContent
          const nextContent = blocks[index + 1].content
          const cursorPosition = currentContent.length // 현재 커서 위치 저장

          // 내용 병합
          const newContent = currentContent + nextContent

          // 블록 업데이트
          const newBlocks = [...blocks]
          newBlocks[index].content = newContent
          newBlocks.splice(index + 1, 1) // 다음 블록 삭제
          updateBlocks(newBlocks)

          // 커서 위치 유지
          nextTick(() => {
            const textNode = currentBlock.firstChild || currentBlock
            const newRange = document.createRange()
            newRange.setStart(textNode, cursorPosition)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
          })
        }
      }
    }
  }

  // ArrowUp 키 처리 함수
  const handleArrowUp = (e, index, blocks, blockRefs, updateBlocks) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const currentBlock = e.target

    const isFirstLine =
      currentBlock.textContent.length === 0 || isCaretAtFirstLine(currentBlock)

    if (isFirstLine && index > 0) {
      e.preventDefault()

      const newBlocks = [...blocks]
      newBlocks[index].content = currentBlock.textContent
      updateBlocks(newBlocks)

      const previousBlock = blockRefs.value[index - 1]
      if (previousBlock) {
        nextTick(() => {
          const textNode = previousBlock.firstChild || previousBlock
          const newRange = document.createRange()
          newRange.setStart(textNode, textNode.textContent.length)
          newRange.collapse(true)

          previousBlock.focus()
          selection.removeAllRanges()
          selection.addRange(newRange)
        })
      }
    }
  }

  // ArrowDown 키 처리 함수
  const handleArrowDown = (e, index, blocks, blockRefs, updateBlocks) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const currentBlock = e.target

    const isLastLine =
      currentBlock.textContent.length === 0 || isCaretAtLastLine(currentBlock)

    if (isLastLine && index < blocks.length - 1) {
      e.preventDefault()

      const newBlocks = [...blocks]
      newBlocks[index].content = currentBlock.textContent
      updateBlocks(newBlocks)

      const nextBlock = blockRefs.value[index + 1]
      if (nextBlock) {
        nextTick(() => {
          const textNode = nextBlock.firstChild || nextBlock
          const newRange = document.createRange()
          newRange.setStart(textNode, 0)
          newRange.collapse(true)

          nextBlock.focus()
          selection.removeAllRanges()
          selection.addRange(newRange)
        })
      }
    }
  }

  const handleBackspace = (e, index, blocks, blockRefs, updateBlocks) => {
    const currentBlock = e.target
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)

    // 커서가 맨 앞에 있는지 확인
    const isAtStart = range.startOffset === 0

    // 이전 블록이 있는 경우에만 처리
    if (index > 0 && isAtStart) {
      e.preventDefault()

      const previousBlock = blockRefs.value[index - 1]
      const currentContent = currentBlock.textContent
      const previousContent = previousBlock.textContent

      if (!currentContent.trim()) {
        // 현재 블록이 비어있는 경우: 현재 블록 삭제
        const newBlocks = [...blocks]
        newBlocks.splice(index, 1)
        updateBlocks(newBlocks)

        // 이전 블록으로 포커스 이동
        nextTick(() => {
          if (previousBlock) {
            previousBlock.focus()

            // 커서를 이전 블록의 맨 끝으로 이동
            const textNode = previousBlock.firstChild || previousBlock
            const endOffset = textNode.textContent.length

            const newRange = document.createRange()
            newRange.setStart(textNode, endOffset)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
        })
      } else {
        // 현재 블록에 내용이 있는 경우: 이전 블록과 병합
        const mergedContent = previousContent + currentContent
        const cursorPosition = previousContent.length // 병합 지점

        // 블록 업데이트
        const newBlocks = [...blocks]
        newBlocks[index - 1].content = mergedContent
        newBlocks.splice(index, 1) // 현재 블록 삭제
        updateBlocks(newBlocks)

        // 커서를 병합 지점으로 이동
        nextTick(() => {
          if (previousBlock) {
            previousBlock.focus()

            const textNode = previousBlock.firstChild || previousBlock
            const newRange = document.createRange()
            newRange.setStart(textNode, cursorPosition)
            newRange.collapse(true)
            selection.removeAllRanges()
            selection.addRange(newRange)
          }
        })
      }
    }
  }

  // 키 다운 이벤트 핸들러
  const handleKeyDown = (e, index, blocks, blockRefs, updateBlocks) => {
    if (e.isComposing) return

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault()
      handleShiftEnter(e, index, blocks, updateBlocks)
      return false
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEnter(e, index, blocks, blockRefs, updateBlocks)
      return false
    }

    if (e.key === "Delete") {
      handleDelete(e, index, blocks, blockRefs, updateBlocks)
    }

    // Backspace 키 처리 추가
    if (e.key === "Backspace") {
      handleBackspace(e, index, blocks, blockRefs, updateBlocks)
    }

    if (e.key === "ArrowUp") {
      handleArrowUp(e, index, blocks, blockRefs, updateBlocks)
    }

    if (e.key === "ArrowDown") {
      handleArrowDown(e, index, blocks, blockRefs, updateBlocks)
    }
  }

  const handleBlockInput = (e, index, blocks, updateBlocks) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const container = range.startContainer
    const offset = range.startOffset

    const newBlocks = [...blocks]
    newBlocks[index].content = e.target.textContent
    updateBlocks(newBlocks)

    nextTick(() => {
      try {
        const textNode =
          container.nodeType === Node.TEXT_NODE
            ? container
            : e.target.firstChild || e.target
        const newRange = document.createRange()
        newRange.setStart(textNode, offset)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } catch (error) {
        console.error("커서 위치 복원 실패:", error)
      }
    })
  }

  return {
    handleKeyDown,
    handleBlockInput,
  }
}
