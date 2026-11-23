<?php

namespace App\Services;

use ZipArchive;

class SimpleXlsxExporter
{
    /**
     * Create a standard Office OpenXML (.xlsx) file.
     *
     * @param  array<int, string>  $headers
     * @param  array<int, array<int, mixed>>  $rows
     * @return string Path to the generated temporary .xlsx file
     */
    public static function create(array $headers, array $rows, string $sheetTitle = 'Transactions'): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'xlsx_').'.xlsx';
        $zip = new ZipArchive;

        if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Unable to create ZIP archive for Excel export.');
        }

        // 1. [Content_Types].xml
        $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>';
        $zip->addFromString('[Content_Types].xml', $contentTypes);

        // 2. _rels/.rels
        $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>';
        $zip->addFromString('_rels/.rels', $rels);

        // 3. xl/_rels/workbook.xml.rels
        $wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>';
        $zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);

        // 4. xl/workbook.xml
        $cleanTitle = htmlspecialchars(mb_substr($sheetTitle, 0, 31), ENT_XML1 | ENT_QUOTES, 'UTF-8');
        $workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="'.$cleanTitle.'" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>';
        $zip->addFromString('xl/workbook.xml', $workbook);

        // 5. xl/styles.xml
        // Style 0: Default
        // Style 1: Header (Bold, Gray fill, centered)
        // Style 2: Number currency format (#,##0.00)
        // Style 3: Date format / centered
        $styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1">
    <numFmt numFmtId="164" formatCode="#,##0.00"/>
  </numFmts>
  <fonts count="2">
    <font><sz val="11"/><name val="Segoe UI"/></font>
    <font><b/><sz val="11"/><color rgb="FF1E293B"/><name val="Segoe UI"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left style="thin"><color rgb="FFE2E8F0"/></left>
      <right style="thin"><color rgb="FFE2E8F0"/></right>
      <top style="thin"><color rgb="FFE2E8F0"/></top>
      <bottom style="thin"><color rgb="FFE2E8F0"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
  </cellXfs>
</styleSheet>';
        $zip->addFromString('xl/styles.xml', $styles);

        // 6. xl/worksheets/sheet1.xml
        $colsXml = '<cols>';
        $colsXml .= '<col min="1" max="1" width="14" customWidth="1"/>';
        $colsXml .= '<col min="2" max="2" width="12" customWidth="1"/>';
        $colsXml .= '<col min="3" max="3" width="22" customWidth="1"/>';
        $colsXml .= '<col min="4" max="4" width="36" customWidth="1"/>';
        $colsXml .= '<col min="5" max="5" width="18" customWidth="1"/>';
        $colsXml .= '<col min="6" max="6" width="18" customWidth="1"/>';
        $colsXml .= '<col min="7" max="7" width="24" customWidth="1"/>';
        $colsXml .= '<col min="8" max="8" width="30" customWidth="1"/>';
        $colsXml .= '<col min="9" max="9" width="35" customWidth="1"/>';
        $colsXml .= '</cols>';

        $sheetData = '<sheetData>';

        // Header Row (Row 1, style 1)
        $sheetData .= '<row r="1" ht="24" customHeight="1">';
        foreach ($headers as $colIdx => $header) {
            $colLetter = self::colLetter($colIdx + 1);
            $val = htmlspecialchars((string) $header, ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $sheetData .= '<c r="'.$colLetter.'1" t="inlineStr" s="1"><is><t>'.$val.'</t></is></c>';
        }
        $sheetData .= '</row>';

        // Data Rows (Starting from Row 2)
        $rowNum = 2;
        foreach ($rows as $row) {
            $sheetData .= '<row r="'.$rowNum.'" ht="20" customHeight="1">';
            foreach ($row as $colIdx => $cellValue) {
                $colLetter = self::colLetter($colIdx + 1);
                $cellRef = $colLetter.$rowNum;

                if (is_numeric($cellValue) && ! is_string($cellValue)) {
                    // Numeric value (e.g. Amount) with currency style (s="2")
                    $sheetData .= '<c r="'.$cellRef.'" s="2"><v>'.$cellValue.'</v></c>';
                } elseif (is_float($cellValue) || (is_numeric($cellValue) && str_contains((string) $cellValue, '.'))) {
                    $sheetData .= '<c r="'.$cellRef.'" s="2"><v>'.(float) $cellValue.'</v></c>';
                } else {
                    $escaped = htmlspecialchars((string) ($cellValue ?? ''), ENT_XML1 | ENT_QUOTES, 'UTF-8');
                    $sheetData .= '<c r="'.$cellRef.'" t="inlineStr" s="0"><is><t>'.$escaped.'</t></is></c>';
                }
            }
            $sheetData .= '</row>';
            $rowNum++;
        }

        $sheetData .= '</sheetData>';

        $worksheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  '.$colsXml.'
  '.$sheetData.'
</worksheet>';

        $zip->addFromString('xl/worksheets/sheet1.xml', $worksheet);
        $zip->close();

        return $tempFile;
    }

    /**
     * Convert 1-based column index to Excel column letters (1 = A, 27 = AA, etc.)
     */
    private static function colLetter(int $col): string
    {
        $letter = '';
        while ($col > 0) {
            $p = ($col - 1) % 26;
            $letter = chr(65 + $p).$letter;
            $col = (int) (($col - $p) / 26);
        }

        return $letter;
    }
}
