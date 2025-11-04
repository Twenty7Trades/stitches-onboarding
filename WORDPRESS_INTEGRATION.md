# WordPress Integration Guide

This guide provides multiple options for integrating the Stitches Onboarding form into your WordPress site.

## Option 1: Iframe Embed (Recommended for Quick Setup)

### Advantages:
- ✅ Quick and easy to implement
- ✅ No WordPress plugin needed
- ✅ Form runs independently
- ✅ Works with any WordPress theme
- ✅ Easy to update (changes reflect automatically)

### Implementation:

#### Method A: Using WordPress Block Editor (Gutenberg)

1. Edit the page/post where you want the form
2. Add a **Custom HTML** block
3. Paste this code:

```html
<div class="stitches-form-container" style="width: 100%; min-height: 800px;">
  <iframe 
    src="https://main.d3t8wpufosawhp.amplifyapp.com/embed" 
    width="100%" 
    height="800" 
    frameborder="0" 
    scrolling="auto"
    style="border: none; width: 100%; min-height: 800px;"
    title="Stitches Clothing Co Application Form"
    allow="clipboard-write"
  ></iframe>
</div>
```

#### Method B: Using Classic Editor / Shortcode

1. Add this to your theme's `functions.php` or create a custom plugin:

```php
<?php
// Add shortcode for Stitches form
function stitches_application_form_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '800',
        'width' => '100%'
    ), $atts);
    
    return '<div class="stitches-form-container" style="width: ' . esc_attr($atts['width']) . '; min-height: ' . esc_attr($atts['height']) . 'px;">
        <iframe 
            src="https://main.d3t8wpufosawhp.amplifyapp.com/embed" 
            width="' . esc_attr($atts['width']) . '" 
            height="' . esc_attr($atts['height']) . '" 
            frameborder="0" 
            scrolling="auto"
            style="border: none; width: ' . esc_attr($atts['width']) . '; min-height: ' . esc_attr($atts['height']) . 'px;"
            title="Stitches Clothing Co Application Form"
            allow="clipboard-write"
        ></iframe>
    </div>';
}
add_shortcode('stitches_form', 'stitches_application_form_shortcode');
```

2. Then use the shortcode in any post/page:
```
[stitches_form height="1000"]
```

#### Method C: Responsive Iframe with JavaScript

Add this to your page for a responsive iframe that adjusts height:

```html
<div class="stitches-form-wrapper" style="position: relative; width: 100%; padding-bottom: 56.25%; overflow: hidden;">
  <iframe 
    id="stitches-iframe"
    src="https://main.d3t8wpufosawhp.amplifyapp.com/embed" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Stitches Clothing Co Application Form"
    allow="clipboard-write"
  ></iframe>
</div>

<script>
// Auto-resize iframe based on content
window.addEventListener('message', function(event) {
  const iframe = document.getElementById('stitches-iframe');
  if (event.data.type === 'STITCHES_FORM_HEIGHT') {
    iframe.style.height = event.data.height + 'px';
  }
});
</script>
```

---

## Option 2: Direct Link (Simple)

### Advantages:
- ✅ No code needed
- ✅ Works perfectly on mobile
- ✅ No iframe limitations

### Implementation:

Simply create a button or link in WordPress:

```html
<a href="https://main.d3t8wpufosawhp.amplifyapp.com/" 
   class="button" 
   target="_blank" 
   rel="noopener noreferrer">
   Apply Now - Contract Client Application
</a>
```

Or use a WordPress button block that links to: `https://main.d3t8wpufosawhp.amplifyapp.com/`

---

## Option 3: WordPress Plugin (Advanced)

Create a custom WordPress plugin for better integration:

### Create: `stitches-application-form/stitches-form.php`

```php
<?php
/**
 * Plugin Name: Stitches Application Form
 * Description: Embed the Stitches Clothing Co application form
 * Version: 1.0.0
 * Author: Stitches Clothing Co
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Register shortcode
function stitches_form_shortcode($atts) {
    $defaults = array(
        'height' => '800',
        'responsive' => 'true'
    );
    
    $atts = shortcode_atts($defaults, $atts);
    $form_url = 'https://main.d3t8wpufosawhp.amplifyapp.com/embed';
    
    $output = '<div class="stitches-form-container" style="width: 100%; position: relative;">';
    
    if ($atts['responsive'] === 'true') {
        $output .= '<div style="position: relative; width: 100%; padding-bottom: 56.25%; overflow: hidden;">';
        $output .= '<iframe src="' . esc_url($form_url) . '" ';
        $output .= 'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" ';
        $output .= 'title="Stitches Clothing Co Application Form" ';
        $output .= 'allow="clipboard-write"';
        $output .= '></iframe>';
        $output .= '</div>';
    } else {
        $output .= '<iframe src="' . esc_url($form_url) . '" ';
        $output .= 'width="100%" ';
        $output .= 'height="' . esc_attr($atts['height']) . '" ';
        $output .= 'frameborder="0" ';
        $output .= 'scrolling="auto" ';
        $output .= 'style="border: none; width: 100%; min-height: ' . esc_attr($atts['height']) . 'px;" ';
        $output .= 'title="Stitches Clothing Co Application Form" ';
        $output .= 'allow="clipboard-write"';
        $output .= '></iframe>';
    }
    
    $output .= '</div>';
    
    return $output;
}
add_shortcode('stitches_application', 'stitches_form_shortcode');

// Add Gutenberg block
function stitches_register_block() {
    register_block_type('stitches/form', array(
        'render_callback' => 'stitches_form_shortcode',
        'attributes' => array(
            'height' => array('type' => 'string', 'default' => '800'),
            'responsive' => array('type' => 'string', 'default' => 'true')
        )
    ));
}
add_action('init', 'stitches_register_block');
```

Install by uploading to `/wp-content/plugins/` and activate.

---

## Option 4: Full-Page Template (Theme Integration)

If you want the form to appear as a full WordPress page:

1. Create a page template: `page-application.php` in your theme
2. Add this code:

```php
<?php
/**
 * Template Name: Application Form
 */
get_header(); ?>

<div class="stitches-application-page">
    <iframe 
        src="https://main.d3t8wpufosawhp.amplifyapp.com/embed" 
        width="100%" 
        height="1200" 
        frameborder="0" 
        scrolling="auto"
        style="border: none; width: 100%; min-height: 1200px;"
        title="Stitches Clothing Co Application Form"
        allow="clipboard-write"
    ></iframe>
</div>

<?php get_footer(); ?>
```

3. Create a new page in WordPress
4. Select "Application Form" as the template

---

## CSS Styling (Optional)

Add this to your theme's CSS to improve the iframe appearance:

```css
.stitches-form-container {
    width: 100%;
    margin: 20px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stitches-form-container iframe {
    display: block;
    background: #f9fafb;
}
```

---

## Mobile Responsiveness

The `/embed` route is optimized for mobile devices. For best results:

1. Use responsive iframe code (Option 1, Method C)
2. Or ensure your WordPress theme is mobile-responsive
3. Test on actual mobile devices

---

## Security & Permissions

The iframe includes:
- `allow="clipboard-write"` - Allows signature canvas to work
- Proper CSP headers set by Next.js
- HTTPS required (secure connection)

---

## Troubleshooting

### Iframe not displaying:
- Check that your WordPress site allows iframes (some security plugins block them)
- Verify the URL is correct: `https://main.d3t8wpufosawhp.amplifyapp.com/embed`
- Check browser console for errors

### Form not submitting:
- Ensure the iframe has `allow="clipboard-write"` attribute
- Check that the form URL is using HTTPS
- Verify browser console for API errors

### Height issues:
- Use the responsive iframe code (Option 1, Method C)
- Or manually adjust the height attribute
- Consider using JavaScript auto-resize

---

## Recommended Approach

For most WordPress sites, **Option 1 (Iframe Embed)** is the best choice because:
- ✅ Quick to implement
- ✅ No WordPress modifications needed
- ✅ Easy to maintain
- ✅ Works with any theme
- ✅ Mobile-friendly

Use the `/embed` route (not the main page) for better iframe integration.

---

## Support

If you need help with the integration, contact:
- Email: Info@StitchesClothingCo.com
- Phone: (775) 355-9161

