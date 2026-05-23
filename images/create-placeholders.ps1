# PowerShell script to create placeholder images using Windows built-in tools
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function Create-PlaceholderImage {
    param(
        [string]$Title,
        [string]$Subtitle,
        [string]$Features,
        [string]$OutputPath,
        [string]$Icon = "💻"
    )
    
    # Create bitmap
    $width = 800
    $height = 600
    $bitmap = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set background gradient (simplified to solid color)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 60, 114))
    $graphics.FillRectangle($brush, 0, 0, $width, $height)
    
    # Set text properties
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $titleFont = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
    $subtitleFont = New-Object System.Drawing.Font("Arial", 14)
    $featuresFont = New-Object System.Drawing.Font("Arial", 11)
    
    # Center alignment
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    # Draw text
    $titleRect = New-Object System.Drawing.Rectangle(0, 150, $width, 60)
    $subtitleRect = New-Object System.Drawing.Rectangle(0, 220, $width, 30)
    $featuresRect = New-Object System.Drawing.Rectangle(0, 300, $width, 200)
    
    $graphics.DrawString($Title, $titleFont, $whiteBrush, $titleRect, $format)
    $graphics.DrawString($Subtitle, $subtitleFont, $whiteBrush, $subtitleRect, $format)
    $graphics.DrawString($Features, $featuresFont, $whiteBrush, $featuresRect, $format)
    
    # Save image
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $whiteBrush.Dispose()
}

# Create placeholder images
$basePath = "c:\Users\nknig\Downloads\Portfolio-Projects-main\Portfolio-Projects-main\PortfolioPage\images"

Create-PlaceholderImage -Title "SPY Data Collection System" -Subtitle "Real-time Financial Data Pipeline" -Features "• Automated SPY stock & options data collection`n• Greeks calculations & historical analysis`n• Windows Task Scheduler integration`n• Multi-source API aggregation" -OutputPath "$basePath\spy-data-system.png"

Create-PlaceholderImage -Title "SPY Options Trading Bot" -Subtitle "AI-Powered Trading System" -Features "• Machine learning signal generation`n• Real-time technical analysis`n• Automated options execution`n• Risk management & Greeks monitoring" -OutputPath "$basePath\spy-trading-bot.png"

Create-PlaceholderImage -Title "VideoBots Automation" -Subtitle "Gaming Video Processing Pipeline" -Features "• Xbox Game Bar integration`n• AI-powered content moderation`n• Whisper transcription & bleeping`n• Automated YouTube uploads" -OutputPath "$basePath\videobots-system.png"

Create-PlaceholderImage -Title "Video Compilation Tool" -Subtitle "Gaming Content Processor" -Features "• FFmpeg-based video processing`n• CUDA acceleration support`n• Automated compilation & cropping`n• Social media optimization" -OutputPath "$basePath\video-compiler.png"

Write-Host "Placeholder images created successfully!"
