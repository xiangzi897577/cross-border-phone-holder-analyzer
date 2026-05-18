function SearchInput({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = '请输入关键词',
}) {
  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="search-input">
      <input
        className="search-input__field"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      <button className="search-input__button" type="button" onClick={onSearch}>
        搜索
      </button>

      {value ? (
        <button
          className="search-input__button search-input__button--secondary"
          type="button"
          onClick={onClear}
        >
          清空
        </button>
      ) : null}
    </div>
  )
}

export default SearchInput
