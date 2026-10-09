$token = Read-Host "Enter your WaniKani API token"

$headers = @{
    "Authorization" = "Bearer $token"
    "Wanikani-Revision" = "20170710"
}

$url = "https://api.wanikani.com/v2/subjects?types=kanji&hidden=false"

$allKanji = [System.Collections.Generic.List[object]]::new()

# Retrieve all pages
while ($url) {
    $response = Invoke-RestMethod -Uri $url -Headers $headers

    foreach ($item in $response.data) {
        $allKanji.Add($item)
    }

    $url = $response.pages.next_url
}

# Create a separate output folder
$outputFolder = Join-Path $PSScriptRoot "Kanji_Updated"

New-Item -ItemType Directory -Path $outputFolder -Force |
    Out-Null

# Generate 60 lesson files
foreach ($level in 1..60) {

    $levelKanji = @(
        $allKanji |
        Where-Object { $_.data.level -eq $level } |
        Sort-Object { $_.data.lesson_position }
    )

    if ($levelKanji.Count -eq 0) {
        throw "No Kanji found for level $level"
    }

    $converted = @(
        foreach ($item in $levelKanji) {
            [PSCustomObject]@{
                KanjiJson = [PSCustomObject]@{
                    lessonNumber = $level
                    id = $item.id
                    kanji = $item.data.characters
                    meanings = $item.data.meanings
                    readings = $item.data.readings
                }
                Meaning = $null
                Reading = $null
            }
        }
    )

    $path = Join-Path $outputFolder "Kanjis_Lesson$level.json"

    ConvertTo-Json -InputObject $converted -Depth 15 |
        Set-Content -Path $path -Encoding UTF8

    Write-Host "Level $level : $($converted.Count) Kanji"
}

Write-Host "Finished! Total Kanji: $($allKanji.Count)"