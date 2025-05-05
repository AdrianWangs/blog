{%- if theme.mermaid.enable %}
{%- set mermaid_uri = theme.vendors.mermaid or '//cdn.jsdelivr.net/npm/mermaid@8/dist/mermaid.min.js' %}
<script{{ pjax }}>
const mermaidBlocks = document.querySelectorAll('pre.mermaid'); // Get all mermaid blocks
if (mermaidBlocks.length) {
  console.log('Found Mermaid blocks:', mermaidBlocks.length); // Log how many blocks were found

  // Log the content of each block before initialization
  mermaidBlocks.forEach((block, index) => {
    console.log(`--- Mermaid Block ${index + 1} Content ---`);
    console.log(block.textContent || block.innerText); // Log the raw text content
    console.log(`--------------------------------------`);
  });

  NexT.utils.getScript('{{ mermaid_uri }}', () => {
    console.log('Mermaid script loaded. Initializing...'); // Log initialization start
    try { // Add try...catch around initialization and rendering
      mermaid.initialize({
        theme    : '{{ theme.mermaid.theme }}',
        logLevel : 3, // Keep logLevel 3 for potential Mermaid internal logs
        flowchart: { curve     : 'linear' },
        gantt    : { axisFormat: '%m/%d/%Y' },
        sequence : { actorMargin: 50 }
        // Consider adding startOnLoad: false if you manually call mermaid.run() later
        // startOnLoad: false
      });
      console.log('Mermaid initialized.');

      // Explicitly render after initialization (if startOnLoad is false or for clarity)
      // mermaid.run({ nodes: mermaidBlocks }); // Or mermaid.init(undefined, mermaidBlocks); depending on version
      // console.log('Mermaid rendering attempted.');

    } catch (e) {
      console.error('Error during Mermaid initialization or rendering:', e);
    }
  }, window.mermaid);
} else {
  console.log('No Mermaid blocks found on this page.');
}
</script>
{%- endif %}