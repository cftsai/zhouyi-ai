from playwright.sync_api import sync_playwright
import sys

def test_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://localhost:8081')
        page.wait_for_load_state('networkidle')

        errors = []

        # 1. 检查页面标题
        title = page.title()
        if '周易算命' not in title:
            errors.append(f'页面标题不正确: {title}')
        else:
            print('✅ 页面标题正确')

        # 2. 检查导航栏
        try:
            page.wait_for_selector('.navbar', timeout=5000)
            print('✅ 导航栏存在')
        except:
            errors.append('导航栏不存在')

        # 3. 检查主题切换按钮
        try:
            theme_btn = page.locator('#theme-toggle')
            if theme_btn.count() > 0:
                print('✅ 主题切换按钮存在')
            else:
                errors.append('主题切换按钮不存在')
        except Exception as e:
            errors.append(f'主题切换按钮检查失败: {e}')

        # 4. 检查历史记录按钮
        try:
            history_btn = page.locator('#history-btn')
            if history_btn.count() > 0:
                print('✅ 历史记录按钮存在')
            else:
                errors.append('历史记录按钮不存在')
        except Exception as e:
            errors.append(f'历史记录按钮检查失败: {e}')

        # 5. 检查 Hero 区域
        try:
            page.wait_for_selector('.hero', timeout=5000)
            print('✅ Hero 区域存在')
        except:
            errors.append('Hero 区域不存在')

        # 6. 检查功能介绍区域
        try:
            page.wait_for_selector('#features', timeout=5000)
            cards = page.locator('.feature-card').count()
            if cards >= 6:
                print(f'✅ 功能卡片存在 ({cards} 个)')
            else:
                errors.append(f'功能卡片数量不足: {cards}')
        except Exception as e:
            errors.append(f'功能介绍区域检查失败: {e}')

        # 7. 检查占卜方式选择器
        try:
            page.wait_for_selector('.method-selector', timeout=5000)
            options = page.locator('.method-option').count()
            if options == 3:
                print('✅ 占卜方式选择器存在 (3 个选项)')
            else:
                errors.append(f'占卜方式选项数量不正确: {options}')
        except Exception as e:
            errors.append(f'占卜方式选择器检查失败: {e}')

        # 8. 测试占卜方式切换
        try:
            bazi_option = page.locator('.method-option[data-method="bazi"]')
            bazi_option.click()
            page.wait_for_timeout(300)
            bazi_fields = page.locator('#bazi-fields')
            if bazi_fields.is_visible():
                print('✅ 八字占卜方式切换正常')
            else:
                errors.append('八字占卜方式切换后表单未显示')
        except Exception as e:
            errors.append(f'占卜方式切换测试失败: {e}')

        # 9. 测试周易64卦占卜
        try:
            zhouyi_option = page.locator('.method-option[data-method="zhouyi"]')
            zhouyi_option.click()
            page.wait_for_timeout(300)

            question_input = page.locator('#question')
            question_input.fill('事业发展如何')

            calc_btn = page.locator('#calc-btn')
            calc_btn.click()

            page.wait_for_selector('#result.show', timeout=10000)
            print('✅ 周易64卦占卜结果展示正常')

            # 检查 SVG 卦象
            svg = page.locator('.hexagram-svg svg')
            if svg.count() > 0:
                print('✅ SVG 卦象渲染正常')
            else:
                errors.append('SVG 卦象未渲染')
        except Exception as e:
            errors.append(f'周易64卦占卜测试失败: {e}')

        # 10. 测试六爻占卜
        try:
            liuyao_option = page.locator('.method-option[data-method="liuyao"]')
            liuyao_option.click()
            page.wait_for_timeout(300)

            calc_btn = page.locator('#calc-btn')
            calc_btn.click()

            page.wait_for_selector('#result.show', timeout=10000)
            print('✅ 六爻占卜结果展示正常')
        except Exception as e:
            errors.append(f'六爻占卜测试失败: {e}')

        # 11. 测试八字测算
        try:
            bazi_option = page.locator('.method-option[data-method="bazi"]')
            bazi_option.click()
            page.wait_for_timeout(300)

            birthdate = page.locator('#birthdate')
            birthdate.fill('1990-05-15')

            calc_btn = page.locator('#calc-btn')
            calc_btn.click()

            page.wait_for_selector('#result.show', timeout=10000)
            print('✅ 八字测算结果展示正常')

            # 检查八字表格
            bazi_table = page.locator('.bazi-table')
            if bazi_table.count() > 0:
                print('✅ 八字表格渲染正常')
            else:
                errors.append('八字表格未渲染')
        except Exception as e:
            errors.append(f'八字测算测试失败: {e}')

        # 12. 测试主题切换
        try:
            theme_btn = page.locator('#theme-toggle')
            theme_btn.click()
            page.wait_for_timeout(500)
            theme = page.evaluate('() => document.documentElement.getAttribute("data-theme")')
            if theme == 'dark':
                print('✅ 主题切换正常 (切换到 dark)')
            else:
                errors.append(f'主题切换后属性不正确: {theme}')
        except Exception as e:
            errors.append(f'主题切换测试失败: {e}')

        # 13. 测试历史记录面板
        try:
            history_btn = page.locator('#history-btn')
            history_btn.click()
            page.wait_for_timeout(500)

            panel = page.locator('#history-panel')
            if panel.is_visible():
                print('✅ 历史记录面板打开正常')
            else:
                errors.append('历史记录面板未打开')

            close_btn = page.locator('#history-close')
            close_btn.click()
            page.wait_for_timeout(300)
        except Exception as e:
            errors.append(f'历史记录面板测试失败: {e}')

        # 14. 检查 Pricing 区块已移除
        try:
            pricing = page.locator('.pricing-section, #pricing')
            if pricing.count() == 0:
                print('✅ Pricing 区块已移除')
            else:
                errors.append('Pricing 区块仍然存在')
        except:
            pass

        # 15. 截图保存
        page.screenshot(path='/workspace/frontend/screenshot.png', full_page=True)
        print('✅ 截图已保存')

        browser.close()

        if errors:
            print('\n❌ 发现以下问题:')
            for err in errors:
                print(f'  - {err}')
            return 1
        else:
            print('\n✅ 所有检查通过!')
            return 0

if __name__ == '__main__':
    sys.exit(test_frontend())
