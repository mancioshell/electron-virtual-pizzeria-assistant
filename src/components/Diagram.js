import * as d3 from 'd3'

const dimension = { width: 1300, height: 800 }
const margin = { top: 10, right: 10, bottom: 50, left: 50 }

const Diagram = (ref, data, max) => {
  let svgElement = d3.select(ref)

  svgElement.selectAll('*').remove()

  const responsivefy = (svg) => {
    const container = d3.select(svg.node().parentNode)
    const newWidth = parseInt(svg.attr('width'), 10)
    const newHeight = parseInt(svg.attr('height'), 10)
    const aspect = newWidth / newHeight

    const resize = () => {
      const targetWidth = parseInt(container.style('width')) - margin.left
      const targetHeight = Math.round(targetWidth / aspect)
      svg.attr('width', targetWidth)
      svg.attr('height', targetHeight)

      //svgElement.select('.xaxis').attr('font-size', targetWidth / 10)
      //svgElement.select('.yaxis').attr('font-size', targetHeight / 8)
    }

    svg
      .attr('viewBox', `0 0 ${newWidth} ${newHeight}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize)

    d3.select(window).on('resize.' + container.attr('id'), resize)
  }

  const wrap = (text, width) => {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr('y'),
        dy = parseFloat(text.attr('dy')),
        tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', dy + 'em')
      while ((word = words.pop())) {
        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', `${++lineNumber * lineHeight + dy}em`)
            .text(word)
        }
      }
    })
  }

  const width = dimension.width - margin.left - margin.right
  const height = dimension.height - margin.top - margin.bottom

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, width])
    .padding(0.2)

  const yScale = d3.scaleLinear().domain([0, max]).range([height, 0])

  const svg = svgElement
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  svg
    .selectAll('mybar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.label))
    .attr('y', (d) => yScale(d.total))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => height - yScale(d.total))
    .attr('fill', (d) => (d.current ? '#0007d6' : '#69b3a2'))

  svg
    .append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft().scale(yScale))
    .attr('font-size', 15)

  svg
    .append('g')
    .attr('class', 'xaxis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom().scale(xScale))
    .attr('font-size', 15)
    .selectAll('.tick text')
    .call(wrap, xScale.bandwidth())

  svgElement.call(responsivefy)
}

export default Diagram
export { Diagram }
